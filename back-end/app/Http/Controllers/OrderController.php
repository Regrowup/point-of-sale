<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Table;
use App\Seat;
use App\Order;
use App\Server;
use App\Item;
use DB;
use App\Services\PrintService;
use App\Location;
use App\Payment;
use App\PaymentType;
use App\Shift;

class OrderController extends Controller
{
    public function paymentTypes() {
        return PaymentType::all();
    }

    public function orderFood(Request $request) {
        $table = DB::transaction(function () use ($request) {
            $table_data = $request->input('table');
            $new_kitchen_orders = [];
            $new_front_orders = [];
            $server;

            /* Update existing table or create a new one */
            if (isset($table_data['id'])) {
                $table = Table::with(['seats' => function ($query) {
                    $query->has('payments', '<', 1);
                }])
                ->findOrFail($table_data['id']);
                $server = $table->server;
            } else {
                $table = new Table;
                $server = Server::findOrFail($table_data['server']['id']);
                $table->server()->associate($server);
                $location = Location::findOrFail($table_data['location']['id']);
                $table->saveOrFail();

                $location = Location::findOrFail($table_data['location']['id']);
                $location->table()->associate($table);
                $location->saveOrFail();

                /* Clock server in at this point if
                 * they have not already been clocked in */
                $open_shifts = $server->shifts()->where('clocked_out_at', null)->count();
                if ($open_shifts == 0) {
                    $shift = new Shift;
                    $shift->server()->associate($server);
                    $shift->saveOrFail();
                }
            }

            $allSeatIds = $table->seats->pluck('id');
            $currentSeatIds = array_pluck($table_data['seats'], 'id');
            $delete_ids = array_diff($allSeatIds->toArray(), $currentSeatIds);

            $allOrderIds = []; /* order IDs currently saved */
            $sentOrderIds = []; /* order IDs which were sent in request */

            foreach($table_data['seats'] as $seat_data) {
                $number = $seat_data['number'];

                /* Update existing seat or create a new one */
                $seat; $allSeatOrderIds = [];
                if (isset($seat_data['id'])) {
                    $seat = Seat::findOrFail($seat_data['id']);

                    $allSeatPaymentIds = $seat->payments->pluck('id');
                    $currentSeatPaymentIds = array_pluck($seat_data['payments'], 'id');
                    $paymentsToDelete = array_diff($allSeatPaymentIds->toArray(), $currentSeatPaymentIds);

                    /* Remove deleted payments */
                    Payment::destroy($paymentsToDelete);

                    /* Determine which orders need to be voided */
                    $allSeatOrderIds = $seat->orders->pluck('id')->toArray();
                } else {
                    $seat = new Seat;
                    $seat->number = $number;
                    $seat->table()->associate($table);
                    $seat->saveOrFail();
                }

                /* Save any payments */
                if (isset($seat_data['payments'])) {
                    foreach($seat_data['payments'] as $payment_data) {
                        $payment;

                        if (isset($payment_data['id'])) {
                            $payment = Payment::findOrFail($payment_data['id']);
                            continue;
                        } else {
                            $payment = new Payment;
                        }

                        $paymentType = PaymentType::findOrFail($payment_data['payment_type_id']);
                        $payment->amount = $payment_data['amount'];
                        $payment->tip = $payment_data['tip'];
                        $payment->server()->associate($server);
                        $payment->seat()->associate($seat);
                        $payment->paymentType()->associate($paymentType);
                        $payment->saveOrFail();
                    }
                }

                $currentSeatOrderIds = array_pluck($seat_data['orders'], 'id');
                $sentOrderIds = array_merge($sentOrderIds, $currentSeatOrderIds);
                $allOrderIds = array_merge($allOrderIds, $allSeatOrderIds);

                /* Add new orders or update position & seat of existing orders */
                foreach($seat_data['orders'] as $position => $order_data) {
                    if (isset($order_data['id'])) {
                        /* This is an item that has already been ordered (sent to the kitchen);
                         * this includes split items (which contain non-null splitNum) */
                        $order = Order::findOrFail($order_data['id']);
                        if ($order->position != $position) {
                            $order->position = $position;
                        }
                        if ($order->seat->id != $seat->id) {
                            $order->seat()->associate($seat);
                        }
                        if (isset($order_data['splitNum'])) {
                            $order->splitNum = $order_data['splitNum'];
                        }
                        $order->price = $order_data['price'];

                        $order->saveOrFail();
                    } else {
                        $item = Item::findOrFail($order_data['item']['id']);
                        $order = new Order;
                        $order->price = isset($order_data['price'])
                            ? $order_data['price']
                            : 0;
                        $order->name = $order_data['name'];
                        $order->position = $position;
                        $order->seat()->associate($seat);
                        $order->item()->associate($item);

                        if (isset($order_data['splitNum'])) {
                            $order->splitNum = $order_data['splitNum'];
                        } else {
                            if ($item->to_kitchen) {
                                if (!isset($new_kitchen_orders[$number])) {
                                    $new_kitchen_orders[$number] = [];
                                }
                                array_push($new_kitchen_orders[$number], $order);
                            } else if ($item->to_front) {
                                if (!isset($new_front_orders[$number])) {
                                    $new_front_orders[$number] = [];
                                }
                                array_push($new_front_orders[$number], $order);
                            }
                        }

                        $order->saveOrFail();
                    }
                }

            }

            /* Remove deleted seats */
            Seat::destroy($delete_ids);

            /* Void deleted orders */
            foreach(array_diff($allOrderIds, $sentOrderIds) as $order_id) {
                $order = Order::findOrFail($order_id);
                $order->voided = true;
                $order->saveOrFail();
            }

            $table->saveOrFail();

            /* Send new orders to the appropriate printers */
            if (count($new_kitchen_orders) > 0) {
                PrintService::printOrder($new_kitchen_orders, $table, 'kitchen');
            }
            if (count($new_front_orders) > 0) {
                PrintService::printOrder($new_front_orders, $table, 'front');
            }

            return $table;
        }, 3);

        return $this->getTable($table->id);
    }

    public function paySeat($table_id, $seat_id, Request $request)
    {
        DB::transaction(function () use ($table_id, $seat_id, $request) {
            $table = Table::where('id', $table_id)
                ->with('location')
                ->withCount(['seats' => function ($query) {
                    $query->has('payments', '<', 1);
                }])
                ->firstOrFail();
            $server = Server::findOrFail($request->input('server_id'));
            $seat = Seat::with(['orders' => function ($query) use ($request) {
                $sent_order_ids = array_pluck($request->input('orders'), 'id');
                $query->whereKeyNot($sent_order_ids);
            }])->findOrFail($seat_id);
            $paymentType = PaymentType::findOrFail($request->input('payment_type_id'));

            /* Mark any missing orders as voided, or dissociate them from current seat
             * if they have been moved. */
            foreach ($seat->orders as $not_sent_order) {
                $order = Order::find($not_sent_order['id']);

                if (!$order) {
                    $order->voided = true;
                } else {

                }

                $order->saveOrFail();
            }

            $payment = new Payment;
            $payment->amount = $request->input('amount');
            $payment->server()->associate($server);
            $payment->seat()->associate($seat);
            $payment->paymentType()->associate($paymentType);
            $payment->saveOrFail();

            /* If this was the last unpaid seat on the table, add a new, empty seat to the table. */
            if ($table->seats_count == 1) {
                $seat = new Seat;
                $seat->number = 1;
                $seat->table()->associate($table);
                $seat->saveOrFail();
            }
        });

        return response(null, 200);
    }

    public function closeTable($table_id)
    {
        $table = Table::where('id', $table_id)
            ->with(['seats' => function ($query) {
                $query->has('payments', '<', 1);
            }, 'seats.orders'])
            ->firstOrFail();

        /* Void any unpaid orders */
        foreach($table->seats as $seat) {
            foreach ($seat->orders as $order) {
                $order->voided = true;
                $order->saveOrFail();
            }
        }

        $table->location->table()->dissociate();
        $table->location->saveOrFail();
        $table->saveOrFail();

        return response(null, 200);
    }

    public function getTable($table_id)
    {
        return Table::where('id', $table_id)->with(['location', 'server', 'seats', 'seats.payments', 'seats.orders' => function ($query) {
            $query->where('voided', false)->orderBy('position');
        }, 'seats.orders.item'])->first();
    }

    public function voidOrder($order_id) {
        $order = Order::findOrFail($order_id);
        $order->voided = true;
        $order->saveOrFail();

        return response(null, 200);
    }

    public function list(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $per_page = 20;
        $q = Order::inDates($startDate, $endDate);

        return [
            'page_data' => (clone $q)->orderBy('created_at', 'desc')->paginate($per_page),
            'total_not_voided' => [
                'count' => (clone $q)->where('voided', false)->count(),
                'price' => (int) (clone $q)->where('voided', false)->sum('price')
            ],
            'total_voided' => [
                'count' => (clone $q)->where('voided', true)->count(),
                'price' => (int) (clone $q)->where('voided', true)->sum('price')
            ],
        ];
    }
}

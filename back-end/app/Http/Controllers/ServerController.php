<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Server;
use App\Shift;
use App\Order;
use App\Services\PrintService;
use Carbon\Carbon;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Arr;

class ServerController extends Controller
{
    public function mysqlDump()
    {
        $db = config('database.connections.mysql.database');
        $user = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');

        $backup_file = base_path().'/db_backups/backup.sql';

        $create_backup = new Process(
            'mysqldump'.
            ' --user='.$user.
            ' --password='.$password.
            ' --host='.$host.
            ' '.$db.
            ' > '.$backup_file
        );
        $create_backup->run();
        if (!$create_backup->isSuccessful()) {
            throw new ProcessFailedException($create_backup);
        }

        return response()->download($backup_file);
    }

    public function mysqlRestore(Request $request)
    {
        $backup = $request->file('backup');

        if (!$request->hasFile('backup')) {
            return response('No file uploaded', 400);
        }

        $db = config('database.connections.mysql.database');
        $user = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');

        $restore_backup = new Process(
            'mysql'.
            ' --user='.$user.
            ' --password='.$password.
            ' --host='.$host.
            ' '.$db.
            ' < '.$backup->path()
        );
        $restore_backup->run();
        if (!$restore_backup->isSuccessful()) {
            throw new ProcessFailedException($restore_backup);
        }

        return response($restore_backup->getOutput(), 200);
    }

    public function list()
    {
        return Server::withCount(['tables as open_tables' => function ($query) {
            $query->has('location');
        }])->get();
    }

    public function getReadout(Request $request, $shift_id)
    {
        $shift = $shift = Shift::with('server')->findOrFail($shift_id);
        $server_name = $shift->server->name;
        $startDate = $shift->clocked_in_at;
        $endDate = $shift->clocked_out_at ?: Carbon::now()->toDateTimeString();

        $server = Server::where('id', $shift->server_id)
            ->withCount(['tables as closed_tables' => function ($query) use ($startDate, $endDate) {
                $query
                    ->inDates($startDate, $endDate)
                    ->has('location', '<', 1);
            }])
            ->with([
                'seats' => function ($query) use ($startDate, $endDate) {
                    $query
                        ->inDates($startDate, $endDate);
                },
                'seats.orders' => function ($query) {
                    $query->where('voided', false);
                },
                'seats.payments',
                'seats.payments.paymentType'
            ])
            ->firstOrFail();

        $payments = [];
        $cash_total = 0;
        $card_total = 0;
        $all_tips = 0;

        foreach ($server->seats as $seat) {
            // $owing = round($seat->orders->sum('price') * 1.13);
            // $received = $seat->payments->sum('amount');
            $tips = $seat->payments->sum('tip');
            $all_tips += $tips;

            foreach ($seat->payments as $payment) {
                $payment_type_name = $payment->paymentType->name;

                if (!array_key_exists($payment_type_name, $payments)) {
                    $payments[$payment_type_name] = [
                        'payments' => 0,
                        'subtotal' => 0,
                        'tip' => 0,
                        'total' => 0
                    ];
                }

                $payments[$payment_type_name]['payments'] += 1;
                $payments[$payment_type_name]['subtotal'] += $payment->amount;
                $payments[$payment_type_name]['tip'] += $payment->tip;
                $total = $payment->amount + $payment->tip;
                $payments[$payment_type_name]['total'] += $total;

                if ($payment->paymentType->name == 'Cash') {
                    $cash_total += $total;
                } else {
                    $card_total += $total;
                }
            }
        }


        $options = [
            'closed_tables' => $server->closed_tables,
            'dates' => [$startDate, $endDate],
            'payments' => $payments,
            'server' => $server,
            'cash_total' => $cash_total,
            'card_total' => $card_total,
            'all_tips' => $all_tips
        ];

        $readout = '';

        $from = (new Carbon($options['dates'][0]))->tz('America/Toronto');
        $to = (new Carbon($options['dates'][1]))->tz('America/Toronto');
        $duration = $to->diffAsCarbonInterval($from)->forHumans(['short' => true]);
        $from_string = $from->toDayDateTimeString();
        $to_string = $to->toDayDateTimeString();
        $closed_tables = $options['closed_tables'];

        $readout .= "From: $from_string\n";
        $readout .= "To: $to_string\n";
        $readout .= "Shift length: $duration\n";
        $readout .= "Tables closed: $closed_tables\n";

        /* Payments */
        foreach ($options['payments'] as $payment_type => $payment) {
            $readout .= "____________\n";

            $readout .= "\n$payment_type\n";

            $count = $payment['payments'];
            $subtotal = number_format(round(($payment['subtotal'] / 100.0), 2), 2);
            $tips = number_format(round(($payment['tip'] / 100.0), 2), 2);
            $total = number_format(round(($payment['total'] / 100.0), 2), 2);
            $readout .= "Payments: $count\n";
            $readout .= "Subtotal: $$subtotal\n";
            $readout .= "Tips: $$tips\n";
            $readout .= "Total: $$total\n";
        }

        $readout .= "____________\n";
        $readout .= "\n";

        $net_sales = ($options['cash_total'] + $options['card_total']) - $options['all_tips'];
        $to_deduct = $net_sales * 0.025;

        $money_owed_to_house = $options['cash_total'] - ($options['all_tips'] - $to_deduct);
        $money_owed_formatted = number_format(round((abs($money_owed_to_house) / 100.0), 2), 2);

        $to_deduct_formatted = number_format(round((abs($to_deduct) / 100.0), 2), 2);
        $readout .= "2.5% tipout: $$to_deduct_formatted\n";

        if ($money_owed_to_house >= 0) {
            $readout .= "Cash owed to house: $$money_owed_formatted";
        } else {
            $readout .= "Cash owed to $server_name: $$money_owed_formatted";
        }

        return response($readout, 200)->header('Content-Type', 'text/plain');
    }

    public function printReadout(Request $request)
    {
        /*
        See: https://www.touchbistro.com/help/articles/server-guide-ending-your-shift/

        E.g.

        From: Monday, April 7th 6:00 pm
        To: Monday, April 7th 10:00 pm
        Shift length: 4 hours

        [Total for each non-empty payment method]
        *Cash*
        Orders: 22
        Subtotal: $156.65

        *Visa*
        Orders: 12
        Subtotal: $456.45
        Tips: $35.00

        Money owed to house = cash subtotal - all tips. If -ve the house owes you money.

        */

        $shift;
        $server_id;
        if ($request->has('server')) {
            $server_id = $request->input('server.id');
            $shift = Shift::where('server_id', $server_id)
                ->orderBy('created_at', 'desc')
                ->first();
        } else {
            $server_id = $request->input('shift.server_id');
            $shift = Shift::find($request->input('shift.id'));
        }

        if (!isset($shift->clocked_out_at)) {
            return response()->json(['message' => 'Please close your last shift before printing your readout.'], 400);
        }

        $startDate = $shift->clocked_in_at;
        $endDate = $shift->clocked_out_at;
        $server = Server::where('id', $server_id)
            ->withCount(['tables as closed_tables' => function ($query) use ($startDate, $endDate) {
                $query
                    ->inDates($startDate, $endDate)
                    ->has('location', '<', 1);
            }])
            ->with([
                'seats' => function ($query) use ($startDate, $endDate) {
                    $query
                        ->inDates($startDate, $endDate);
                },
                'seats.orders' => function ($query) {
                    $query->where('voided', false);
                },
                'seats.payments',
                'seats.payments.paymentType'
            ])
            ->firstOrFail();

        $payments = [];
        $cash_total = 0;
        $card_total = 0;
        $all_tips = 0;

        foreach ($server->seats as $seat) {
            // $owing = round($seat->orders->sum('price') * 1.13);
            // $received = $seat->payments->sum('amount');
            $tips = $seat->payments->sum('tip');
            $all_tips += $tips;

            foreach ($seat->payments as $payment) {
                $payment_type_name = $payment->paymentType->name;

                if (!array_key_exists($payment_type_name, $payments)) {
                    $payments[$payment_type_name] = [
                        'payments' => 0,
                        'subtotal' => 0,
                        'tip' => 0,
                        'total' => 0
                    ];
                }

                $payments[$payment_type_name]['payments'] += 1;
                $payments[$payment_type_name]['subtotal'] += $payment->amount;
                $payments[$payment_type_name]['tip'] += $payment->tip;
                $total = $payment->amount + $payment->tip;
                $payments[$payment_type_name]['total'] += $total;

                if ($payment->paymentType->name == 'Cash') {
                    $cash_total += $total;
                } else {
                    $card_total += $total;
                }
            }
        }

        return PrintService::printReadout([
            'closed_tables' => $server->closed_tables,
            'dates' => [$startDate, $endDate],
            'payments' => $payments,
            'server' => $server,
            'cash_total' => $cash_total,
            'card_total' => $card_total,
            'all_tips' => $all_tips
        ]);
    }

    public function stats(Request $request)
    {
        /* Fix $-0.00 display bug */
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $per_page = 20;
        $q = Server::where('is_disabled', 0)
            ->withCount(['tables as closed_tables' => function ($query) use ($startDate, $endDate) {
                $query
                    ->inDates($startDate, $endDate)
                    ->has('location', '<', 1);
            }])
            ->with([
                'seats' => function ($query) use ($startDate, $endDate) {
                    $query
                        ->inDates($startDate, $endDate)
                        ->has('payments');
                },
                'seats.payments',
                'seats.orders' => function ($query) {
                    $query->where('voided', false);
                }
            ]);

        return [
            'page_data' => $q->orderBy('created_at', 'desc')->paginate($per_page),
        ];
    }

    public function add(Request $request) {
        $server = Server::findOrNew($request->input('id'));
        $server->name = $request->input('name');
        $server->pin = $request->input('pin');
        $server->is_admin = $request->input('is_admin');
        $server->is_disabled = $request->input('is_disabled');
        $server->saveOrFail();

        return response(null, 200);
    }

    public function removeServer($server_id) {
        Server::destroy($server_id);
        return response(null, 200);
    }
}

<?php

namespace App\Services;

use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\EscposImage;
use Carbon\Carbon;
use App\Item;

class PrintService {
    static function printReadout($options) {
        if (config('printer.mock')) return response(null, 200);

        $ip_address = config('printer.thermal');
        $connector = new NetworkPrintConnector($ip_address, 9100);
        $printer = new Printer($connector);

        $reponse;
        try {
            /* Server name and date */
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
            $server_name = $options['server']->name;
            $printer->text("$server_name\n");

            $printer->selectPrintMode();

            $from = (new Carbon($options['dates'][0]))->tz('America/Toronto');
            $to = (new Carbon($options['dates'][1]))->tz('America/Toronto');
            $duration = $to->diffAsCarbonInterval($from)->forHumans(['short' => true]);
            $from_string = $from->toDayDateTimeString();
            $to_string = $to->toDayDateTimeString();
            $closed_tables = $options['closed_tables'];

            $printer->text("From: $from_string\n");
            $printer->text("To: $to_string\n");
            $printer->text("Shift length: $duration\n");
            $printer->text("Tables closed: $closed_tables\n");

            /* Payments */
            foreach ($options['payments'] as $payment_type => $payment) {
                $printer->setUnderline(Printer::UNDERLINE_DOUBLE);
                $printer->text(str_repeat('_', 12) . "\n");
                $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
                $printer->text("\n$payment_type\n");
                $printer->selectPrintMode();
                $printer->setUnderline(Printer::UNDERLINE_NONE);

                $count = $payment['payments'];
                $subtotal = number_format(round(($payment['subtotal'] / 100.0), 2), 2);
                $tips = number_format(round(($payment['tip'] / 100.0), 2), 2);
                $total = number_format(round(($payment['total'] / 100.0), 2), 2);
                $printer->text("Payments: $count\n");
                $printer->text("Subtotal: $$subtotal\n");
                $printer->text("Tips: $$tips\n");
                $printer->text("Total: $$total\n");
            }

            $printer->setUnderline(Printer::UNDERLINE_DOUBLE);
            $printer->text(str_repeat('_', 12) . "\n");
            $printer->selectPrintMode(Printer::MODE_EMPHASIZED);

            $printer->text("\n");

            $net_sales = ($options['cash_total'] + $options['card_total']) - $options['all_tips'];
            $to_deduct = $net_sales * 0.025;

            $money_owed_to_house = $options['cash_total'] - ($options['all_tips'] - $to_deduct);
            $money_owed_formatted = number_format(round((abs($money_owed_to_house) / 100.0), 2), 2);

            $to_deduct_formatted = number_format(round((abs($to_deduct) / 100.0), 2), 2);
            $printer->text("2.5% tipout: $$to_deduct_formatted\n");

            if ($money_owed_to_house >= 0) {
                $printer->text("Cash owed to house: $$money_owed_formatted");
            } else {
                $printer->text("Cash owed to $server_name: $$money_owed_formatted");
            }

            $printer->feed(3);

            /* End */
            $printer->selectPrintMode();
            $printer->cut();

            $reponse = response()->json(['message' => 'Print complete.'], 200);
        } catch (Exception $e) {
            $reponse = response()->json([
                'message' => 'Print failed.',
                'error' => $e->getMessage()
            ], 400);
        } finally {
            $printer->close();
        }

        return $reponse;
    }

    static function printOrder($orders, $table, $location) {
        if (config('printer.mock')) return response(null, 200);

        $ip_address = ($location == 'front')
            ? config('printer.thermal')
            : config('printer.impact');

        $connector = new NetworkPrintConnector($ip_address, 9100);
        $printer = new Printer($connector);

        $reponse;
        try {
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH | Printer::MODE_EMPHASIZED);

            /* Server name, table #, and seat # */
            $server = $table->server->name;
            $printer->text("Server: $server\n");
            $table_number = $table->location->number;
            $printer->text("Table: $table_number\n\n");
            $dt = Carbon::now('America/Toronto');
            $date = $dt->toDateString();
            $time = $dt->toTimeString();
            $printer->text("$date\n");
            $printer->text("$time\n\n");

            /* Menu items */
            foreach($orders as $seat_number => $seat_orders) {
                $printer->setUnderline(Printer::UNDERLINE_DOUBLE);
                $printer->text(str_repeat('_', 12) . "\n");
                $printer->setUnderline(Printer::UNDERLINE_NONE);

                $number = $seat_number;
                $printer->text("Seat: $number\n");

                $printer->setUnderline(Printer::UNDERLINE_DOUBLE);
                $printer->text(str_repeat('_', 12) . "\n\n");
                $printer->setUnderline(Printer::UNDERLINE_NONE);

                foreach($seat_orders as $order) {
                    if ($order->item->name == 'Kitchen Mod' && $order->item->visible == false) {
                        $printer->text('MOD: ');
                    }

                    $printer->text("$order->name\n");
                    if (isset($order->item->name_alt)) {
                        $name_alt = $order->item->name_alt;
                        $printer->text("($name_alt)\n");
                    }
                    $printer->text("\n");
                }
            }

            $printer->text("\n");

            /* End */
            $printer->selectPrintMode();
            $printer->cut();

            $reponse = response()->json(['message' => 'Print complete.'], 200);
        } catch (Exception $e) {
            $reponse = response()->json([
                'message' => 'Print failed.',
                'error' => $e->getMessage()
            ], 400);
        } finally {
            $printer->close();
        }

        return $reponse;
    }

    static function printReceipt($seat, $table, $options) {
        if (config('printer.mock')) return response(null, 200);

        /* Set up and connect to printer */
        $connector = new NetworkPrintConnector(config('printer.thermal'), 9100);
        $printer = new Printer($connector);

        $reponse;
        try {
            /* Top logo */
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            // $logo = EscposImage::load('../storage/app/public/aranka_logo_300.png');
            $logo = EscposImage::load(public_path('aranka_logo_300.png'));

            /* @todo: Uncomment for newer printers. Make this a config/option. */
            // $printer->graphics($logo);
            $printer->bitImage($logo);

            $printer->feed();

            /* Restaurant contact info and current date */
            $printer->setEmphasis(true);
            $printer->text("Hungarian Restaurant\n");
            $printer->text("Aranka Csárda");
            $printer->setEmphasis(false);
            $printer->feed(2);
            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $printer->text(self::columns("7447 Longwoods Rd", "(519) 652-9696"));
            $left = "London, ON, Canada";
            $right = Carbon::now('America/Toronto')->format('d/m/Y g:i A');
            $printer->text(self::columns($left, $right));
            $printer->text("N6P 1L2");
            $printer->feed(2);

            /* Server name, table #, and seat # */
            $server = $table['server']['name'];
            $printer->text("Your server: $server\n");
            if (isset($table['id'])) {
                $table_number = $table['location']['number'] . ' [' . $table['id'] . ']';
            } else {
                $table_number = $table['location']['number'];
            }
            $printer->text("Table: $table_number");
            if (!$options['combined']) {
                $printer->text("    ");
                $seat_number = $seat['number'];
                $printer->text("Seat: $seat_number");
            }
            $printer->text("\n");
            $printer->feed();

            /* Separator */
            $line = '    ' . str_repeat("*", config('printer.receipt_width') - 8) . '    ';
            $printer->text("$line\n");

            /* Menu items and price */
            $printer->feed();

            $subtotal = 0;
            if ($options['combined']) {
                foreach ($table['seats'] as $seat) {
                    foreach ($seat['orders'] as $order) {
                        if (
                            (isset($order['item']) && $order['item'] == 'mod') ||
                            (isset($order['item_id']) && Item::findOrFail($order['item_id'])->name == 'Kitchen Mod')
                        ) {
                            continue;
                        }
                        $subtotal += $order['price'];
                        $left = $order['name'];
                        $right = '$' . number_format(round(($order['price'] / 100.0), 2), 2);
                        $printer->text(self::columns($left, $right));
                    }
                }
            } else {
                foreach ($seat['orders'] as $order) {
                    if ((isset($order['item']) && $order['item'] == 'mod') ||
                        (isset($order['item_id']) && Item::findOrFail($order['item_id'])->name == 'Kitchen Mod')) {
                        continue;
                    }
                    $name = isset($order['splitNum'])
                        ? '(1/' . $order['splitNum'] . ') ' . $order['name']
                        : $order['name'];

                    $subtotal += $order['price'];
                    $left = $name;
                    $right = '$' . number_format(round(($order['price'] / 100.0), 2), 2);
                    $printer->text(self::columns($left, $right));
                }
            }

            $printer->text("\n");
            $printer->feed();

            /* Totals (subtotal, HST, total to pay) */
            $printer->setJustification(Printer::JUSTIFY_RIGHT);
            $subtotal_formatted = '$' . number_format(round(($subtotal / 100.0), 2), 2);
            $printer->text("Subtotal: $subtotal_formatted\n");
            $hst = '$' . number_format(round((($subtotal*0.13) / 100.0), 2), 2);
            $printer->text("HST @13%: $hst\n");
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
            $total = '$' . number_format(round((($subtotal*1.13) / 100.0), 2), 2);
            $printer->text("Total: $total\n");
            $printer->selectPrintMode();
            $printer->feed(3);

            /* Salutation */
            $printer->setEmphasis(true);
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("Thank you!\n");
            $printer->setEmphasis(false);
            $printer->feed(2);

            /* End */
            $printer->cut();

            $reponse = response()->json(['message' => 'Print complete.'], 200);
        } catch (Exception $e) {
            $reponse = response()->json([
                'message' => 'Print failed.',
                'error' => $e->getMessage()
            ], 400);
        } finally {
            $printer->close();
        }

        return $reponse;
    }

    static function columns($left, $right) {
        $min_padding = 3;
        $padding_length = config('printer.receipt_width') - (strlen($left) + strlen($right));
        if ($padding_length < $min_padding) {
            $ellipses = "...";
            $overflow = $min_padding - $padding_length;

            $end = strlen($left) - $overflow - strlen($ellipses);
            $left = substr($left, 0, $end) . $ellipses;
            $padding_length = $min_padding;
        }

        $padding = str_repeat(" ", $padding_length);
        return "$left$padding$right\n";
    }
}

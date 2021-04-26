<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Payment;
use App\Order;

class PaymentController extends Controller
{
    public function list(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $per_page = 20;
        $q = Payment::inDates($startDate, $endDate);

        /* This is the total payments received (for legacy payments with NULL tip) */
        $amount_legacy = (int) (clone $q)->whereNull('tip')->sum('amount');

        /* This is the total payments received (new) */
        $tip = (int) (clone $q)->sum('tip');
        $amount = (int) (clone $q)->whereNotNull('tip')->sum('amount') + $tip;

        /* This is the total cost of all orders */
        $cost_legacy = (int) Order::where('voided', false)
            ->whereHas('seat.payments', function ($query) use ($startDate, $endDate) {
                $query->inDates($startDate, $endDate)
                    ->whereNull('tip');
            })
            ->sum('price');
        $cost = (int) Order::where('voided', false)
            ->whereHas('seat.payments', function ($query) use ($startDate, $endDate) {
                $query->inDates($startDate, $endDate)
                    ->whereNotNull('tip');
            })
            ->sum('price');

        /* This is the total tax payments received */
        $tax_legacy = round($cost_legacy * 0.13);
        $tax = round($cost * 0.13);

        /* This is the total tip payments received */
        $legacy_tip = $amount_legacy - $cost_legacy - $tax_legacy;
        $total_tip = $legacy_tip + $tip;

        return [
            'page_data' => (clone $q)->orderBy('created_at', 'desc')->paginate($per_page),
            'total' => [
                'count' => (clone $q)->count(),
                'amount' => $amount_legacy + $amount,
                'tax' => $tax_legacy + $tax,
                'tip' => $total_tip
            ]
        ];
    }
}

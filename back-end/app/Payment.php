<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public function server()
    {
        return $this->belongsTo('App\Server');
    }

    public function seat()
    {
        return $this->belongsTo('App\Seat');
    }

    public function paymentType()
    {
        return $this->belongsTo('App\PaymentType');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        return $query->with('paymentType')->whereBetween('payments.created_at', [$startDate, $endDate]);
    }
}

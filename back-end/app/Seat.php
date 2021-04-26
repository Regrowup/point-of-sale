<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    public function table()
    {
        return $this->belongsTo('App\Table');
    }

    public function orders()
    {
        return $this->hasMany('App\Order');
    }

    public function payments()
    {
        return $this->hasMany('App\Payment');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('seats.created_at', [$startDate, $endDate]);
    }
}

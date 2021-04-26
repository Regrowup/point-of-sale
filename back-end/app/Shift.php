<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    public function server()
    {
        return $this->belongsTo('App\Server');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('clocked_in_at', [$startDate, $endDate]);
    }
}

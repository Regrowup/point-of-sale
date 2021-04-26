<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    public function server()
    {
        return $this->belongsTo('App\Server');
    }

    public function location()
    {
        return $this->hasOne('App\Location');
    }

    public function seats()
    {
        return $this->hasMany('App\Seat');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}

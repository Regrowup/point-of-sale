<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    protected $fillable = ['name', 'pin', 'is_admin'];

    public function tables()
    {
        return $this->hasMany('App\Table');
    }

    public function payments()
    {
        return $this->hasMany('App\Payment');
    }

    public function seats()
    {
        return $this->hasManyThrough('App\Seat', 'App\Table');
    }

    public function shifts()
    {
        return $this->hasMany('App\Shift');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}

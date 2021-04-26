<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Item;

class Order extends Model
{
    protected $fillable = ['name', 'price'];

    public function item()
    {
        return $this->belongsTo('App\Item');
    }

    public function seat()
    {
        return $this->belongsTo('App\Seat');
    }

    public function scopeInDates($query, $startDate, $endDate)
    {
        $mod_id = Item::where('name', 'Kitchen Mod')->first()->id;

        return $query
            ->with('item')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where(function ($q) use ($mod_id) {
                $q->where('item_id', '!=', $mod_id)
                    ->orWhereNull('item_id');
            });
    }
}

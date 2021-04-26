<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    // visible determines whether or not the item shows up on the receipt
    protected $fillable = ['name', 'price', 'name_alt', 'description', 'visible', 'to_kitchen', 'to_front'];

    // protected $attributes = [
    //     'visible' => true,
    //     'to_kitchen' => true,
    //     'to_front' => false
    // ];

    public function orders()
    {
        return $this->hasMany('App\Order');
    }

    public function category()
    {
        return $this->belongsTo('App\Category');
    }

    public function optionGroups()
    {
        return $this->belongsToMany('App\OptionGroup');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $fillable = ['name', 'price', 'name_alt'];
    
    /* Can take it's attributes from a menu item */
    public function item()
    {
        return $this->belongsTo('App\Item');
    }
    
    /* Options can belong to one or many groups */
    public function optionGroups()
    {
        return $this->belongsToMany('App\OptionGroup');
    }
}

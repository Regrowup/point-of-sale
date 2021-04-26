<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OptionGroup extends Model
{
    protected $fillable = ['name'];
    
    /* Option groups can contain one or more options */
    public function options()
    {
        return $this->belongsToMany('App\Option');
    }
}

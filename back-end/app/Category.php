<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];
    
    public function items()
    {
        return $this->hasMany('App\Item');
    }
    
    public function topCategory()
    {
        return $this->belongsTo('App\TopCategory');
    }
}

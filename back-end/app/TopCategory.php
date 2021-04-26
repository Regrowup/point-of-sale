<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TopCategory extends Model
{
    protected $fillable = ['name'];
    
    public function categories()
    {
        return $this->hasMany('App\Category');
    }
}

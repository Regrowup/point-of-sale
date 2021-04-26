<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    protected $fillable = ['rows', 'cols'];
    
    public function locations()
    {
        return $this->hasMany('App\Location');
    }
}

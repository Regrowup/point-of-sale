<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    // protected $fillable = ['row', 'col'];
    
    public function layout()
    {
        return $this->belongsTo('App\Layout');
    }
    
    public function table()
    {
        return $this->belongsTo('App\Table');
    }
}

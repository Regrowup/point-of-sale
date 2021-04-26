<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentType extends Model
{
    public function payments()
    {
        return $this->hasMany('App\Payment');
    }
}

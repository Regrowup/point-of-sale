<?php

use Illuminate\Database\Seeder;
use App\PaymentType;

class PaymentTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = ['Cash', 'Debit', 'Mastercard', 'Visa', 'AMEX'];

        foreach($types as $type) {
            PaymentType::create([ 'name' => $type ]);
        }
    }
}

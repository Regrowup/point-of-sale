<?php

use Illuminate\Database\Seeder;
use App\TopCategory;

class TopCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $titles = ['Food', 'Drinks', 'Brunch', 'Other'];
        
        foreach($titles as $name) {
            TopCategory::create([ 'name' => $name ]);
        }
    }
}

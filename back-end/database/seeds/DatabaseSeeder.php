<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ServersTableSeeder::class);
        
        $this->call(LayoutsTableSeeder::class);
        $this->call(LocationsTableSeeder::class);
        
        $this->call(TopCategoriesTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        
        $this->call(ItemsTableSeeder::class);
        
        $this->call(PaymentTypesTableSeeder::class);
    }
}

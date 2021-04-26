<?php

use Illuminate\Database\Seeder;
use App\Layout;
use App\Location;

class LayoutsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Location::getQuery()->delete();
        Layout::getQuery()->delete();
        Layout::create([
            'name' => 'Dining Room',
            'rows' => 4,
            'cols' => 11
        ]);
    }
}

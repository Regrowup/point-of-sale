<?php

use Illuminate\Database\Seeder;
use App\Location;
use App\Layout;

class LocationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $layout = Layout::first();
        
        $table_numbers = [
            1, 2, 3, 4, 5, 6, 51, 54, 57,
            11, 12, 13, 14, 15, 16, 52, 55, 58,
            21, 22, 23, 24, 25, 26, 53, 56, 59,
            31, 32, 33, 41, 42, 43, 44
        ];
        
        foreach([0, 1, 2, 3] as $row) {
            foreach([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as $col) {
                if (($col == 3 && $row <= 2) || $col == 7 || ($row == 3 && $col >= 7)) {
                    continue;
                }
                
                $number = array_shift($table_numbers);
                $type = 'table';
                if ($row == 3 && $col >= 3 ) {
                    $type = 'bar';
                }
                
                Location::create([
                    'number' => $number,
                    'type' => $type,
                    'row' => $row,
                    'col' => $col,
                    'layout_id' => $layout->id
                ]);
            }
        }
    }
}

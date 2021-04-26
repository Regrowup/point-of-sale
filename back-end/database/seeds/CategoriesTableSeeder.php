<?php

use Illuminate\Database\Seeder;
use App\Category;
use App\TopCategory;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $topCat = TopCategory::where('name', 'Food')->first();
        $titles = ['Apps', 'Soups & Salads', 'Entrées', 'Kids Menu', 'Desserts'];
        foreach($titles as $name) {
            Category::create([ 'name' => $name, 'top_category_id' => $topCat->id ]);
        }
        
        $topCat = TopCategory::where('name', 'Drinks')->first();
        $titles = ['Hot Drinks', 'Sodas', 'Juice & Milk'];
        foreach($titles as $name) {
            Category::create([ 'name' => $name, 'top_category_id' => $topCat->id ]);
        }
        
        $topCat = TopCategory::where('name', 'Other')->first();
        $titles = ['Sides, Extras, Options', 'Misc'];
        foreach($titles as $name) {
            Category::create([ 'name' => $name, 'top_category_id' => $topCat->id ]);
        }
        
        $topCat = TopCategory::where('name', 'Brunch')->first();
        $titles = ['Egg Breakfast', 'Side Orders', 'Scramblers', 'Sandwiches', 'Brunch Specialties', 'Crepes & French Toast'];
        foreach($titles as $name) {
            Category::create([ 'name' => $name, 'top_category_id' => $topCat->id ]);
        }
    }
}

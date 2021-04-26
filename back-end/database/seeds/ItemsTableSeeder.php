<?php

use Illuminate\Database\Seeder;
use App\Category;
use App\Item;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cat = Category::where('name', 'Apps')->first();
        foreach([
            // [ 'name' => 'Cold Plate', 'price' => 1600, 'name_alt' => 'Hidegtál', 'category_id' => $cat->id ],
            [ 'name' => 'Hortobagyi Crepe', 'price' => 995, 'category_id' => $cat->id ],
            [ 'name' => 'Cheese Squares', 'price' => 895, 'name_alt' => 'Rántott Sajt', 'category_id' => $cat->id ],
            [ 'name' => 'Fried Mushrooms', 'price' => 795, 'name_alt' => 'Rántott Gomba', 'category_id' => $cat->id ],
            [ 'name' => 'Double Dip Plate', 'price' => 1200, 'category_id' => $cat->id ],
            [ 'name' => 'Poutine', 'price' => 700, 'category_id' => $cat->id ],
            [ 'name' => 'Poutine (double)', 'price' => 1200, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Soups & Salads')->first();
        foreach([
            [ 'name' => 'Soup of the Day', 'price' => 550, 'name_alt' => 'leves', 'category_id' => $cat->id ],
            [ 'name' => 'Chicken Noodle Soup', 'price' => 550, 'name_alt' => 'Tyúkhúsleves', 'category_id' => $cat->id ],
            [ 'name' => 'Goulash (App)', 'price' => 700, 'name_alt' => 'Kis Gulyásleves', 'category_id' => $cat->id ],
            [ 'name' => 'House Salad (App)', 'price' => 595, 'name_alt' => 'Bugaci Saláta (Eloetel)', 'category_id' => $cat->id ],
            [ 'name' => 'Spinach Salad (App)', 'price' => 795, 'category_id' => $cat->id ],
            [ 'name' => 'Goat Cheese Salad (App)', 'price' => 795, 'category_id' => $cat->id ]
            // [ 'name' => 'Cabbage Salad', 'price' => 600, 'name_alt' => 'Kaposzta Salata', 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Entrées')->first();
        foreach([
            [ 'name' => 'House Salad', 'price' => 1100, 'name_alt' => 'Bugaci Saláta', 'category_id' => $cat->id ],
            [ 'name' => 'Spinach Salad', 'price' => 1275, 'category_id' => $cat->id ],
            [ 'name' => 'Goat Cheese Salad', 'price' => 1275, 'category_id' => $cat->id ],
            [ 'name' => 'Goulash', 'price' => 1200, 'category_id' => $cat->id ],
            // [ 'name' => 'Potato Pasta', 'price' => 1300, 'name_alt' => 'Krumplis Tészta', 'category_id' => $cat->id ],
            [ 'name' => 'Cheese Pasta', 'price' => 1400, 'name_alt' => 'Túrós Csusza', 'category_id' => $cat->id ],
            [ 'name' => 'Shepherd\'s Pasta', 'price' => 1350, 'category_id' => $cat->id ],
            [ 'name' => 'Fish and Chips', 'price' => 1500, 'category_id' => $cat->id ],
            [ 'name' => 'Cabbage Rolls', 'price' => 1500, 'name_alt' => 'Töltött Káposzta', 'category_id' => $cat->id ],
            // [ 'name' => 'Stuffed Peppers', 'price' => 1600, 'name_alt' => 'Töltött Paprika', 'category_id' => $cat->id ],
            [ 'name' => 'Chicken Paprikash', 'price' => 1550, 'category_id' => $cat->id ],
            [ 'name' => 'Beef Stew', 'price' => 1550, 'category_id' => $cat->id ],
            [ 'name' => 'Gypsy Chop', 'price' => 2100, 'name_alt' => 'Cigánypecsenye', 'category_id' => $cat->id ],
            [ 'name' => 'Chicken & Mushrooms', 'price' => 1700, 'category_id' => $cat->id ],
            [ 'name' => 'Pork Schnitzel', 'price' => 1500, 'category_id' => $cat->id ],
            // [ 'name' => 'Schnitzel - Beef', 'price' => 1700, 'name_alt' => 'Rántott Szelet - Marha', 'category_id' => $cat->id ],
            // [ 'name' => 'Schnitzel - Pork', 'price' => 1500, 'name_alt' => 'Rántott Szelet - Sertés', 'category_id' => $cat->id ],
            [ 'name' => 'Ribs (Half)', 'price' => 1700, 'category_id' => $cat->id ],
            [ 'name' => 'Ribs (Full)', 'price' => 2200, 'category_id' => $cat->id ],
            [ 'name' => 'Entrée Platter (Two)', 'price' => 3400, 'category_id' => $cat->id ],
            [ 'name' => 'Entrée Platter (Four)', 'price' => 6400, 'category_id' => $cat->id ],
            /* Specials */
            [ 'name' => 'Soup and Salad', 'price' => 1050, 'name_alt' => 'Leves és Saláta', 'category_id' => $cat->id ],
            [ 'name' => 'Schnitzel Sandwich', 'price' => 1200, 'name_alt' => 'Sertés Szelet szendvics', 'category_id' => $cat->id ],
            [ 'name' => 'Chicken Sandwich', 'price' => 1300, 'name_alt' => 'Csirke Szendvics', 'category_id' => $cat->id ],
            [ 'name' => 'Ham Sandwich', 'price' => 1100, 'name_alt' => 'Marha Szendvics', 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Kids Menu')->first();
        foreach([
            [ 'name' => 'Kids Half Stuffed Pepper', 'price' => 695, 'name_alt' => 'Gyerek Fél Töltött Paprika', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Cheese Sticks', 'price' => 695, 'name_alt' => 'Gyerek Sajtrudak', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Fried Fish', 'price' => 695, 'name_alt' => 'Gyerek Sült Hal', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Pork Schnitzel', 'price' => 695, 'name_alt' => 'Gyerek Sertés Szelet', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Pasta', 'price' => 695, 'name_alt' => 'Gyerek Vaj Tészta', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Dessert', 'price' => 0, 'name_alt' => 'Gyerek Édesség', 'category_id' => $cat->id ],
            [ 'name' => 'Kids Milk/Juice Refill', 'price' => 100, 'category_id' => $cat->id, 'to_kitchen' => false ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Hot Drinks')->first();
        foreach([
            [ 'name' => 'Coffee', 'price' => 225, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Tea', 'price' => 225, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Hot Chocolate', 'price' => 300, 'category_id' => $cat->id, 'to_kitchen' => false ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Sodas')->first();
        foreach([
            [ 'name' => 'Coke', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Diet Coke', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Sprite', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Iced Tea', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Ginger Ale', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Soda', 'price' => 250, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Shirley Temple', 'price' => 350, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Perrier', 'price' => 275, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Bottled Water', 'price' => 150, 'category_id' => $cat->id, 'to_kitchen' => false ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Juice & Milk')->first();
        foreach([
            [ 'name' => 'Milk', 'price' => 300, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Apple Juice', 'price' => 300, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Orange Juice', 'price' => 300, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Lemonade', 'price' => 300, 'category_id' => $cat->id, 'to_kitchen' => false ],
            [ 'name' => 'Virgin Caesar', 'price' => 400, 'category_id' => $cat->id, 'to_kitchen' => false ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Desserts')->first();
        foreach([
            [ 'name' => 'Trifle', 'price' => 550, 'name_alt' => 'Somlói', 'category_id' => $cat->id ],
            [ 'name' => 'Crepes', 'price' => 475, 'name_alt' => 'Palacsinta', 'category_id' => $cat->id ],
            [ 'name' => 'Apple Strudel', 'price' => 525, 'name_alt' => '', 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Sides, Extras, Options')->first();
        foreach([
            [ 'name' => 'Add Chicken', 'price' => 500, 'name_alt' => 'Kis Csirke', 'category_id' => $cat->id ],
            [ 'name' => 'Side Fries', 'price' => 350, 'name_alt' => 'Kis Hasábburgonya', 'category_id' => $cat->id ],
            [ 'name' => 'Side Steamed Potato', 'price' => 350, 'name_alt' => 'Kis Krumpli', 'category_id' => $cat->id ],
            [ 'name' => 'Side Vegetables', 'price' => 350, 'name_alt' => 'Kis Zöldség', 'category_id' => $cat->id ],
            [ 'name' => 'Side Rice', 'price' => 350, 'name_alt' => 'Kis Rizs', 'category_id' => $cat->id ],
            [ 'name' => 'Gravy', 'price' => 125, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Misc')->first();
        foreach([
            [ 'name' => 'Custom Item', 'price' => 0, 'category_id' => $cat->id, 'visible' => false ],
            [ 'name' => 'Kitchen Mod', 'price' => 0, 'category_id' => $cat->id, 'visible' => false ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Egg Breakfast')->first();
        foreach([
            [ 'name' => 'Classic Eggs', 'price' => 495, 'category_id' => $cat->id ],
            [ 'name' => 'Traditional Eggs', 'price' => 675, 'category_id' => $cat->id ],
            [ 'name' => 'The Canadian', 'price' => 795, 'category_id' => $cat->id ],
            [ 'name' => 'Big Breakfast', 'price' => 1095, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Scramblers')->first();
        foreach([
            [ 'name' => 'Farmers Scrambler', 'price' => 1095, 'category_id' => $cat->id ],
            [ 'name' => 'The Hot Hungarian', 'price' => 785, 'category_id' => $cat->id ],
            [ 'name' => 'Veggie', 'price' => 895, 'category_id' => $cat->id ],
            [ 'name' => 'Build Your Own', 'price' => 875, 'category_id' => $cat->id ],
            [ 'name' => 'Additional Topping', 'price' => 85, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Side Orders')->first();
        foreach([
            [ 'name' => 'Bacon (3)', 'price' => 295, 'category_id' => $cat->id ],
            [ 'name' => 'Egg', 'price' => 160, 'category_id' => $cat->id ],
            [ 'name' => 'Ham (2)', 'price' => 295, 'category_id' => $cat->id ],
            [ 'name' => 'Toast (2)', 'price' => 195, 'category_id' => $cat->id ],
            [ 'name' => 'Sausage (3)', 'price' => 295, 'category_id' => $cat->id ],
            [ 'name' => 'Bagel', 'price' => 265, 'category_id' => $cat->id ],
            [ 'name' => 'Peameal (2)', 'price' => 395, 'category_id' => $cat->id ],
            [ 'name' => 'French Toast (1)', 'price' => 365, 'category_id' => $cat->id ],
            [ 'name' => 'Home Fries', 'price' => 355, 'category_id' => $cat->id ],
            [ 'name' => 'Egg Bread (1)', 'price' => 395, 'category_id' => $cat->id ],
            [ 'name' => 'Debrecener Sausage', 'price' => 475, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Sandwiches')->first();
        foreach([
            [ 'name' => 'Breakfast Sandwich', 'price' => 795, 'category_id' => $cat->id ],
            [ 'name' => 'Western Sandwich', 'price' => 1195, 'category_id' => $cat->id ],
            [ 'name' => 'BLT', 'price' => 995, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Brunch Specialties')->first();
        foreach([
            [ 'name' => 'Chicken and the Egg', 'price' => 1395, 'category_id' => $cat->id ],
            [ 'name' => 'Debrecen\'s Specialty', 'price' => 1195, 'category_id' => $cat->id ],
            [ 'name' => 'Fish & Chips', 'price' => 1500, 'category_id' => $cat->id ],
            [ 'name' => 'Pork Chop & Eggs', 'price' => 1995, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
        
        $cat = Category::where('name', 'Crepes & French Toast')->first();
        foreach([
            [ 'name' => 'Hortobagyi Crepes', 'price' => 995, 'category_id' => $cat->id ],
            [ 'name' => 'Strawberry Crepes', 'price' => 875, 'category_id' => $cat->id ],
            [ 'name' => 'Banana Nutella Crepes', 'price' => 875, 'category_id' => $cat->id ],
            [ 'name' => 'French Toast', 'price' => 755, 'category_id' => $cat->id ],
            [ 'name' => 'Chocolate French Toast', 'price' => 925, 'category_id' => $cat->id ],
            [ 'name' => 'Maple French Toast', 'price' => 925, 'category_id' => $cat->id ]
        ] as $item) {
            Item::create($item);
        }
    }
}

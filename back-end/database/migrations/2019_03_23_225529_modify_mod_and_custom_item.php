<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Item;
use App\Category;

class ModifyModAndCustomItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('items', function (Blueprint $table) {
            $table->integer('category_id')->unsigned()->nullable()->change();
        });

        $custom_item = Item::where('name', 'Custom Item')->first();
        if (isset($custom_item)) {
            $custom_item->category()->dissociate();
            $custom_item->save();
        }

        $mod_item = Item::where('name', 'Kitchen Mod')->first();
        if (isset($mod_item)) {
            $mod_item->category()->dissociate();
            $mod_item->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items', function (Blueprint $table) {
            $table->integer('category_id')->unsigned()->change();
        });

        $category = Category::where('name', 'Misc')->first();

        if (isset($category)) {
            $custom_item = Item::where('name', 'Custom Item')->first();
            $custom_item->category()->associate($category);

            $mod_item = Item::where('name', 'Kitchen Mod')->first();
            $mod_item->category()->associate($category);
        }
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name', 100)->unique();
            $table->integer('price');
            $table->string('description', 500)->nullable();
            
            /* Sets whether the item is printed on the bill */
            $table->boolean('on_bill')->default(true);
            
            /* Hungarian name, shows up when sending to kitchen */
            $table->string('name_alt', 100)->nullable();
            
            /* Sets visibility of item on menu. False means it doesn't show up in the menu */
            $table->boolean('visible')->default(true);
            
            /* @todo: Improve printer config; toggle sending to any printers */
            $table->boolean('to_kitchen')->default(true);
            $table->boolean('to_front')->default(false);
            
            $table->integer('category_id')->unsigned();
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items', function ($table) {
            $table->dropForeign('items_category_id_foreign');
        });
        
        Schema::dropIfExists('items');
    }
}

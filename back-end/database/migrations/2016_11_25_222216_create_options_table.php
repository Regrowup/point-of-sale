<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100)->unique();
            $table->string('name_alt', 100)->nullable();
            $table->integer('price');
            $table->timestamps();
            
            /* An option could belong to a menu item, taking it's name, name_alt, and price */
            $table->integer('item_id')->unsigned()->nullable();
            $table->foreign('item_id')->references('id')->on('items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('options', function ($table) {
            $table->dropForeign('options_item_id_foreign');
        });
        
        Schema::dropIfExists('options');
    }
}

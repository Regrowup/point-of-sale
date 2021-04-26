<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemOptionGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_option_group', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            
            $table->integer('item_id')->unsigned();
            $table->foreign('item_id')->references('id')->on('items');
            
            $table->integer('option_group_id')->unsigned();
            $table->foreign('option_group_id')->references('id')->on('option_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('item_option_group', function ($table) {
            $table->dropForeign('item_option_group_item_id_foreign');
        });
        
        Schema::table('item_option_group', function ($table) {
            $table->dropForeign('item_option_group_option_group_id_foreign');
        });
        
        Schema::dropIfExists('item_option_group');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('price')->nullable();
            $table->integer('position')->unsigned();
            $table->boolean('voided')->default(false);
            $table->string('name', 100);
            
            $table->integer('item_id')->unsigned();
            $table->foreign('item_id')->references('id')->on('items');
            
            $table->integer('seat_id')->unsigned();
            $table->foreign('seat_id')->references('id')->on('seats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function ($table) {
            $table->dropForeign('orders_item_id_foreign');
        });
        
        Schema::table('orders', function ($table) {
            $table->dropForeign('orders_seat_id_foreign');
        });
        
        Schema::dropIfExists('orders');
    }
}

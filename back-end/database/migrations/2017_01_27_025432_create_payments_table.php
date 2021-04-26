<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('amount');
            
            $table->integer('server_id')->unsigned();
            $table->foreign('server_id')->references('id')->on('servers');
            
            $table->integer('seat_id')->unsigned();
            $table->foreign('seat_id')->references('id')->on('seats');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payments', function ($table) {
            $table->dropForeign('payments_server_id_foreign');
        });
        
        Schema::table('payments', function ($table) {
            $table->dropForeign('payments_seat_id_foreign');
        });
      
        Schema::dropIfExists('payments');
    }
}

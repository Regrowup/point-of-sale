<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('number')->unsigned();
            
            $table->integer('table_id')->unsigned();
            $table->foreign('table_id')->references('id')->on('tables');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('seats', function ($table) {
            $table->dropForeign('seats_table_id_foreign');
        });
        Schema::dropIfExists('seats');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->unsignedInteger('row');
            $table->unsignedInteger('col');
            $table->unsignedInteger('number');
            $table->enum('type', ['table', 'bar']);
            
            $table->integer('table_id')->unsigned()->nullable();
            $table->foreign('table_id')->references('id')->on('tables');
            
            $table->integer('layout_id')->unsigned();
            $table->foreign('layout_id')->references('id')->on('layouts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('locations', function ($table) {
            $table->dropForeign('locations_table_id_foreign');
        });
        Schema::table('locations', function ($table) {
            $table->dropForeign('locations_layout_id_foreign');
        });
        Schema::dropIfExists('locations');
    }
}

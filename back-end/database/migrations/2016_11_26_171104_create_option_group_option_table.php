<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionGroupOptionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('option_group_option', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            
            $table->integer('option_group_id')->unsigned();
            $table->foreign('option_group_id')->references('id')->on('option_groups');
            
            $table->integer('option_id')->unsigned();
            $table->foreign('option_id')->references('id')->on('options');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('option_group_option', function ($table) {
            $table->dropForeign('option_group_option_option_id_foreign');
        });
        
        Schema::table('option_group_option', function ($table) {
            $table->dropForeign('option_group_option_option_group_id_foreign');
        });
        
        Schema::dropIfExists('option_group_option');
    }
}

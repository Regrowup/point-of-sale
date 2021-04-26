<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->timestamp('clocked_in_at')->useCurrent();
            $table->timestamp('clocked_out_at')->nullable();

            $table->integer('server_id')->unsigned()->nullable();
            $table->foreign('server_id')->references('id')->on('servers')->onDelete('set null');
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
            $table->dropForeign(['server_id']);
        });

        Schema::dropIfExists('shifts');
    }
}

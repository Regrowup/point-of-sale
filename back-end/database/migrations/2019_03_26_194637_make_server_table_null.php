<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeServerTableNull extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tables', function (Blueprint $table) {
            $table->integer('server_id')->unsigned()->nullable()->change();
            $table->dropForeign(['server_id']);
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
        Schema::table('tables', function (Blueprint $table) {
            $table->integer('server_id')->unsigned()->change();
            $table->dropForeign(['server_id']);
            $table->foreign('server_id')->references('id')->on('servers');
        });
    }
}

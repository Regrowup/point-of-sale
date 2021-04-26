<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeItemIdNullOnCascadeDelete extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('item_id')->unsigned()->nullable()->change();
            $table->dropForeign(['item_id']);
            $table->foreign('item_id')->references('id')->on('items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('item_id')->unsigned()->change();
            $table->dropForeign(['item_id']);
            $table->foreign('item_id')->references('id')->on('items');
        });
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDeleteCascadeToItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('items', function (Blueprint $table) {
            // $table->dropForeign(['category_id']);
            $table->dropForeign('items_category_id_foreign');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('items', function (Blueprint $table) {
            // $table->dropForeign(['category_id']);
            $table->dropForeign('items_category_id_foreign');
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }
}

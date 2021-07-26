<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('roles', function (Blueprint $table) {
            $table->timestamps();
            $table->increments('id');
            $table->string('name');
            $table->rememberToken();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->timestamps();
            $table->increments('id');
            $table->string('name', 100);
            $table->string('roles', 200)->default('CLIENT');
            $table->string('lang', 2)->default('en');
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

// Auth Endpoints
Route::group([
    'prefix' => 'v1/auth'
], function ($router) {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('logout', 'Auth\LogoutController@logout');
    Route::post('register', 'Auth\RegisterController@register');
    Route::post('forgot-password', 'Auth\ForgotPasswordController@email');
    Route::post('password-reset', 'Auth\ResetPasswordController@reset');
});

// Resource Endpoints
Route::group([
    'prefix' => 'v1'
], function ($router) {
    Route::apiResource('todo', 'TodoController');
});

// Not Found
Route::fallback(function () {
    return response()->json(['message' => 'Resource not found.'], 404);
});

// v2

// Auth Endpoints
Route::group([
    'prefix' => 'v2/auth'
], function ($router) {
    Route::post('login', 'v2\Auth\LoginController@login');
    Route::post('logout', 'v2\Auth\LogoutController@logout');
    Route::post('register', 'v2\Auth\RegisterController@register');
    Route::post('forgot-password', 'v2\Auth\ForgotPasswordController@email');
    Route::post('recover/{token}', 'v2\Auth\ResetPasswordController@reset');
    Route::get('recover/{token}', 'v2\Auth\ResetPasswordController@resetInfo');
});


// Data Endpoints json
Route::group([
    'prefix' => 'v2/data'
], function ($router) {
    Route::get('list', 'v2\JsondataController@list');
    Route::get('json/{jsondata}', 'v2\JsondataController@json');
    Route::put('json/add', 'v2\JsondataController@add');
    Route::delete('json/{jsondata}', 'v2\JsondataController@destroy');
    Route::post('json/{jsondata}', 'v2\JsondataController@edit');
    Route::get('json/{jsondata}/download', 'v2\JsondataController@download');
});

// Viz details
Route::group([
    'prefix' => 'v2/viz'
], function ($router) {
    Route::get('{refer}', 'v2\VisdataController@refer');
    Route::delete('{table}', 'v2\VisdataController@delete');
    Route::put('{refer}', 'v2\VisdataController@rerun');
});

// Viz list
Route::group([
    'prefix' => 'v2/options'
], function ($router) {
    Route::get('viz', 'v2\OptionsController@viz');
    Route::get('{table}', 'v2\OptionsController@data');
});


// Scatter Data 
Route::group([
    'prefix' => 'v2/asn'
], function ($router) {
    Route::get('list', 'v2\AsnController@index');
    Route::get('data', 'v2\AsnfavController@index');
    Route::post('addfav', 'v2\AsnfavController@store');
    Route::delete('removefav/{asnfav}', 'v2\AsnfavController@destroy');
});

Route::group([
    'prefix' => 'v2/provider'
], function ($router) {
    Route::get('/{id_asn}/profile/{id_country}', 'v2\AsnController@profile');
    Route::get('/{id_asn}/as_customers/{id_country}', 'v2\AsnController@as_customers');
});

Route::group([
    'prefix' => 'v2/internet'
], function ($router) {
    Route::get('index', 'v2\InternetIndexController@index');
});

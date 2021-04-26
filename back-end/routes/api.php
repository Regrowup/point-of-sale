<?php

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

Route::get('servers', 'ServerController@list');
Route::get('servers/stats', 'ServerController@stats');
Route::post('servers/add', 'ServerController@add');
Route::delete('servers/{server_id}', 'ServerController@removeServer');
Route::post('servers/print-readout', 'ServerController@printReadout');

Route::get('payment-types', 'OrderController@paymentTypes');
Route::get('layouts', 'LayoutController@index');
Route::get('menu', 'MenuController@index');
Route::post('menu/item/add', 'MenuController@addMenuItem');
Route::post('menu/category/add', 'MenuController@addCategory');
Route::delete('menu/item/{item_id}/delete', 'MenuController@removeMenuItem');
Route::delete('/menu/topcategory/{category_id}', 'MenuController@removeTopCategory');
Route::delete('/menu/subcategory/{category_id}', 'MenuController@removeSubcategory');

Route::patch('menu/item/{item_id}/edit', 'MenuController@editMenuItem');

Route::post('tables/order', 'OrderController@orderFood');
// Route::post('tables/save', 'OrderController@saveTable');

// Load table for TableEditor
Route::get('tables/{table_id}', 'OrderController@getTable');

// Route::delete('orders/{order_id}', 'OrderController@voidOrder');
Route::post('tables/seat/print', 'PrintReceiptController');

// Pay for table
Route::post('tables/{table_id}/{seat_id}/pay', 'OrderController@paySeat');
Route::post('tables/{table_id}/close', 'OrderController@closeTable');

// Get data for reports
Route::get('/orders', 'OrderController@list');
Route::get('/payments', 'PaymentController@list');

Route::get('/mysql_dump', 'ServerController@mysqlDump');
Route::post('/mysql_restore', 'ServerController@mysqlRestore');

// @todo: Remove PrinterController

Route::post('/shifts/clock-in', 'ShiftController@clockIn');
Route::post('/shifts/clock-out', 'ShiftController@clockOut');
Route::get('/shifts', 'ShiftController@list');
Route::get('/shifts/{shift_id}/readout', 'ServerController@getReadout');
Route::patch('/shifts/{shift_id}', 'ShiftController@update');
Route::post('/shifts/report', 'ShiftController@generateReport');

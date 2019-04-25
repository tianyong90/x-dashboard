<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('wakatime/summaries', 'Api\WakatimeController@summaries');
Route::get('wakatime/stats', 'Api\WakatimeController@stats');
Route::get('wakatime/goals', 'Api\WakatimeController@goals');

Route::get('github/calendar', 'Api\GitHubController@calendar');
Route::get('github/current-user-feeds', 'Api\GitHubController@currentUserFeeds');

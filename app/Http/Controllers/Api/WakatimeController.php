<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client as Guzzle;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mabasic\WakaTime\WakaTime;

class WakatimeController extends Controller
{
    public function stats()
    {
        $wakatime = new WakaTime(new Guzzle, env('WAKATIME_API_KEY'));

        $stats = $wakatime->stats('last_7_days');

        return response()->json($stats);
    }
}

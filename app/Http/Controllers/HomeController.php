<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client as Guzzle;
use Illuminate\Http\Request;
use Mabasic\WakaTime\WakaTime;

class HomeController extends Controller
{
    public function welcome()
    {
        $wakatime = new WakaTime(new Guzzle, env('WAKATIME_API_KEY'));

        $stats = $wakatime->stats('last_7_days');

        dd($stats);

        return view('welcome');
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $wakatime = new WakaTime(new Guzzle, env('WAKATIME_API_KEY'));

        $stats = $wakatime->stats('last_7_days');

        return view('index', compact('stats'));
    }
}

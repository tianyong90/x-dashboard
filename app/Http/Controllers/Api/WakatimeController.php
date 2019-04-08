<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client as Guzzle;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mabasic\WakaTime\WakaTime;

class WakatimeController extends Controller
{
    /**
     * @var WakaTime
     */
    private $wakatime;

    /**
     * @var \Illuminate\Config\Repository|mixed
     */
    private $cacheSeconds;

    /**
     * WakatimeController constructor.
     */
    public function __construct()
    {
        $this->wakatime = new WakaTime(new Guzzle, config('wakatime.api_key'));

        $this->cacheSeconds = config('wakatime.cache_seconds');
    }

    public function stats()
    {
        $stats = \Cache::remember('wakatime_stats', $this->cacheSeconds, function () {
            return $this->wakatime->stats('last_7_days');
        });

        return response()->json($stats);
    }
}

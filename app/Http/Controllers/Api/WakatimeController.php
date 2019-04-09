<?php

namespace App\Http\Controllers\Api;

use Cache;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mabasic\WakaTime\WakaTime;
use Carbon\Carbon;

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

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function summaries()
    {
        $summaries = Cache::remember('wakatime_summaries', $this->cacheSeconds, function () {
            return $this->wakatime->summaries(Carbon::today()->subDays(6)->format('Y-m-d'), Carbon::today()->format('Y-m-d'));
        });

        return response()->json($summaries);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        $stats = Cache::remember('wakatime_stats', $this->cacheSeconds, function () {
            return $this->wakatime->stats('last_7_days');
        });

        return response()->json($stats);
    }
}

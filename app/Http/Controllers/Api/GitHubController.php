<?php

namespace App\Http\Controllers\Api;

use Goutte\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GitHubController extends Controller
{
    public function calendar()
    {
        $client = new Client();

        $crawler = $client->request('GET', 'https://github.com/users/tianyong90/contributions');

        $calendarData = [];

        $crawler->filter('svg.js-calendar-graph-svg > g > g > rect.day')
            ->each(function ($node) use (&$calendarData) {
                array_push($calendarData, [
                    'date' => $node->attr('data-date'),
                    'fill' => $node->attr('fill'),
                    'count' => $node->attr('data-count'),
                ]);
            });

        return response()->json($calendarData);
    }
}

<?php

namespace App\Http\Controllers\Api;

use Goutte\Client;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Cache;

class GitHubController extends Controller
{
    /**
     * 近一年的活跃日历数据
     *
     * 思路来自 https://stackoverflow.com/questions/18262288/finding-total-contributions-of-a-user-from-github-api
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function calendar()
    {
        $calendarData = Cache::remember('github_calendar_date', 120, function () {
            $client = new Client();
            $crawler = $client->request('GET', 'https://github.com/users/tianyong90/contributions');

            $result = [];

            $crawler->filter('svg.js-calendar-graph-svg > g > g')
                ->each(function ($node, $weekIndex) use (&$result) {
                    $node->filter('rect.day')->each(function ($dayRect, $index) use (&$result, $weekIndex) {
                        array_push($result, [
                            'date' => $dayRect->attr('data-date'),
                            'fill' => $dayRect->attr('fill'),
                            'count' => $dayRect->attr('data-count'),
                            'day' => $index,
                            'week' => $weekIndex,
                        ]);
                    });
                });

            return $result;
        });

        return response()->json($calendarData);
    }

    /**
     * user private feed url
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function privateFeedUrl()
    {
        $client = new GuzzleClient();

        // current_user_url 只有在 basic 授权模式下可获取
        $currentUserUrl = Cache::remember('gh_feeds_current_user_url', 120, function () use ($client) {
            $urlsResponse = $client->get('https://api.github.com/feeds', [
                'auth' => [config('github.connections.other.username'), config('github.connections.other.password')]
            ]);

            $feedsUrls = json_decode($urlsResponse->getBody()->getContents(), true);

            return $feedsUrls['current_user_url'];
        });

        return $currentUserUrl;
    }
}

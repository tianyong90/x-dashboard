<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GitHub;
use GuzzleHttp\Client as GuzzleClient;

class HomeController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
//        $client = new GuzzleClient();
//
//        $response = $client->get('https://api.github.com/feeds', [
//            'auth' => ['tianyong90', 'tianyong316.']
//        ]);
//
//        $feedsUrls = json_decode($response->getBody()->getContents(), true);
//
////        dd($feedsUrls);
//
//        $rrr = $client->get($feedsUrls['current_user_url'], [
//            'headers' => [
//                'Accept' => 'application/atom+xml',
//            ],
//        ]);
//
//        dump($rrr->getBody()->getContents());
//
//        return;

        return view('index');
    }
}

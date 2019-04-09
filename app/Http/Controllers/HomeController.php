<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client as Guzzle;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        // TODO
        $response = (new Guzzle())->get('https://github.com/users/tianyong90/contributions');

        dd($response->getBody()->getContents());

        return view('index');
    }
}

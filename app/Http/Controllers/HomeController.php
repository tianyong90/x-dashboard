<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GitHub;

class HomeController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        // TODO
//        $orgs = GitHub::repo();
//
//        dd($orgs);

        return view('index');
    }
}

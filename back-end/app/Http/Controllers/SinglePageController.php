<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use File;

class SinglePageController extends Controller
{
    public function index() {
        return File::get(public_path() . '/app/index.html');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Layout;

class LayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Layout::with([
            'locations.table.server',
            'locations.table.seats' => function ($query) {
                $query->has('payments', '<', 1);
            }
        ])->get();
    }
}

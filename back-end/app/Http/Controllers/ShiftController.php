<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Shift;
use App\Server;
use App\Exports\ShiftsExport;
use Maatwebsite\Excel\Facades\Excel;

class ShiftController extends Controller
{
    public function clockIn(Request $request) {
        $server = Server::findOrFail($request->input('id'));

        $open_shifts = $server->shifts()->where('clocked_out_at', null)->count();
        if ($open_shifts > 0) {
            return response()->json(['message' => $server->name . ' is already clocked in.'], 400);
        }

        $shift = new Shift;
        $shift->server()->associate($server);
        $shift->saveOrFail();

        return Shift::find($shift->id);
    }

    public function clockOut(Request $request) {
        $server = Server::findOrFail($request->input('id'));

        $open_shift = $server->shifts()->where('clocked_out_at', null)->first();
        if (!isset($open_shift)) {
            return response()->json([
                'message' => 'Cannot clock out ' . $server->name . '; user has no active shifts. You must clock in first.'
            ], 400);
        }

        $open_shift->clocked_out_at = now();
        $open_shift->saveOrFail();

        return $open_shift;
    }

    public function list(Request $request) {
        $per_page = 20;

        return [
            'page_data' => Shift::with('server')->orderBy('created_at', 'desc')->paginate($per_page)
        ];
    }

    public function update(Request $request, $shift_id) {
        $shift = Shift::findOrFail($shift_id);
        $shift->clocked_out_at = $request->clocked_out_at;
        $shift->clocked_out_at = $request->clocked_out_at;
        $shift->saveOrFail();

        $per_page = 20;
        return [
            'page_data' => Shift::with('server')->orderBy('created_at', 'desc')->paginate($per_page)
        ];
    }

    public function generateReport(Request $request) {
        return Excel::download(new ShiftsExport(
            $request->input('from_date'),
            $request->input('to_date'),
            $request->input('server_ids'),
        ), 'shifts.csv');

        // return Shift::with('server')
        //     ->orderBy('created_at', 'desc')
        //     ->get()
        //     ->downloadExcel('shifts.csv', null, true);

        // return (new ShiftsExport)->download('shifts.csv');
    }
}

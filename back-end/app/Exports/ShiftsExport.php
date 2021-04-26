<?php

namespace App\Exports;

use Carbon\Carbon;
use App\Server;
use App\Shift;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ShiftsExport implements FromQuery, WithMapping, WithHeadings
{
    use Exportable;

    public function __construct($from_date, $to_date, $server_ids)
    {
        $this->from_date = $from_date;
        $this->to_date = $to_date;
        $this->server_ids = $server_ids;
    }

    public function headings(): array
    {
        return [
            'Employee',
            'From date',
            'To date',
            'Hours worked in selected time frame',
            'Hourly wage',
            'Total payable'
        ];
    }

    /**
    * @var Server $server
    */
    public function map($server): array
    {
        $hours_worked = $server->shifts->sum(function ($shift) {
            $clocked_in = new Carbon($shift->clocked_in_at);
            $clocked_out = new Carbon($shift->clocked_out_at);

            return $clocked_out->diffInHours($clocked_in);
        });

        return [
            $server->name,
            (new Carbon($this->from_date))->tz('America/Toronto')->toFormattedDateString(),
            (new Carbon($this->to_date))->tz('America/Toronto')->toFormattedDateString(),
            $hours_worked,
            0,
            0
        ];
    }

    public function query()
    {
        return Server::query()
            ->whereIn('id', $this->server_ids)
            ->with(['shifts' => function ($query) {
                $query->inDates($this->from_date, $this->to_date);
            }]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrintReceiptRequest;
use App\Services\PrintService;

class PrintReceiptController extends Controller {
    public function __invoke(PrintReceiptRequest $request)
    {
        if ($request->hasNoSeatData()) {
            $tableData = $request->getTableData();
            $this->printReceiptWithCombinedDataFromAllSeats($tableData);

            return response(null, 200);
        }

        $seats = $request->getSeatData();
        $this->printReceiptForEachSeat($seats);

        return response(null, 200);
    }

    /**
     * @param $tableData
     */
    private function printReceiptWithCombinedDataFromAllSeats($tableData): void
    {
        if (count($tableData['seats']) > 0) {
            PrintService::printReceipt(null, $tableData, ['combined' => true]);
        }
    }

    /**
     * @param $seats
     */
    private function printReceiptForEachSeat($seats): void
    {
        foreach ($seats as $seat) {
            PrintService::printReceipt($seat, null, ['combined' => false]);
        }
    }
}

<?php

namespace App\Http\Requests;

use App\Order;
use Illuminate\Foundation\Http\FormRequest;

class PrintReceiptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }

    /**
     * @param $orders
     * @return array
     */
    private function getValidOrders($orders): array
    {
        return array_values(array_filter($orders, function ($order) {
            return isset($order['id']) && Order::find($order['id']);
        }));
    }

    /**
     * @return bool
     */
    public function hasNoSeatData(): bool
    {
        $seatData = $this->input('seat');
        return !isset($seatData);
    }

    /**
     * @return array
     */
    public function getTableData(): array
    {
        $tableData = $this->input('table');

        $tableData['seats'] = collect($tableData['seats'])
            ->map(function ($seat) {
                $seat['orders'] = $this->getValidOrders($seat['orders']);
                return $seat;
            })
            ->filter(function ($seat) {
                return count($seat['orders']) > 0;
            })
            ->values()
            ->toArray();

        return $tableData;
    }

    public function hasTableData(): bool
    {
        return count($this->getTableData()['seats']) > 0;
    }

    public function getSeatData()
    {
        $seatData = $this->input('seat');

        if (!array_key_exists('0', $seatData)) {
            $seatData = [$seatData];
        }

        return collect($seatData)
            ->map(function ($seat) {
                $seat['orders'] = $this->getValidOrders($seat['orders']);
                return $seat;
            })
            ->filter(function ($seat) {
                return count($seat['orders']) > 0;
            });
    }
}

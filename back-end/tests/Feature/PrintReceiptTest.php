<?php

namespace Tests\Feature;

use App\Services\PrintService;
use Tests\TestCase;
use App\Order;
use AspectMock\Test as test;

class PrintReceiptTest extends TestCase
{
    private $printServiceMock;
    private $orderMock;
    private $invalidOrderId = 'invalid';

    protected function setUp(): void
    {
        parent::setUp();
        $this->printServiceMock = test::double(PrintService::class, ['printReceipt' => null]);
        $this->orderMock = test::double(Order::class, ['find' => function($params) {
            $id = $params[0];

            if ($id === $this->invalidOrderId) {
                return false;
            }

            return true;
        }]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        test::clean();
    }

    public function testPrintReceiptWithSingleValidOrder()
    {
        $orderId = 7;
        $tableData = [
            'seats' => [
                ['orders' => [['id' => $orderId]]]
            ]
        ];
        $payload = ['table' => $tableData];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyInvokedOnce('printReceipt', [
            null,
            $tableData,
            ['combined' => true]
        ]);
        $this->orderMock->verifyInvokedOnce('find', $orderId);
    }

    public function testOrderWithNoValidOrders()
    {
        $payload = [
            'table' => [
                'seats' => [
                    ['orders' => [[]]],
                    ['orders' => [[]]],
                    ['orders' => [[]]]
                ]
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyNeverInvoked('printReceipt');
        $this->orderMock->verifyNeverInvoked('find');
    }

    public function testWithOrdersNotFoundInDatabase()
    {
        $this->orderMock = test::double(Order::class, ['find' => false]);
        $payload = [
            'table' => [
                'seats' => [
                    ['orders' => [['id' => 1]]],
                    ['orders' => [['id' => 2]]],
                    ['orders' => [['id' => 3]]]
                ]
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyNeverInvoked('printReceipt');
    }

    public function testWithSomeValidOrders()
    {
        $seatsWithValidOrders = [
            ['orders' => [['id' => 7], ['id' => 8]]],
            ['orders' => [['id' => 10]]],
        ];
        $invalidOrder = ['id' => $this->invalidOrderId];
        $seatWithInvalidOrders = ['orders' => [$invalidOrder, $invalidOrder]];
        $payload = [
            'table' => [
                'seats' => [
                    $seatWithInvalidOrders,
                    ['orders' => []],
                    array_merge_recursive($seatsWithValidOrders[0], $seatWithInvalidOrders),
                    ['orders' => [$invalidOrder]],
                    ['orders' => []],
                    array_merge_recursive($seatWithInvalidOrders, $seatsWithValidOrders[1]),
                ]
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyInvokedOnce('printReceipt', [
            null,
            ['seats' => $seatsWithValidOrders],
            ['combined' => true]
        ]);
    }

    public function testWithInvalidSeatData()
    {
        $invalidOrder = ['id' => $this->invalidOrderId];
        $payload = [
            'seat' => [
                ['orders' => [[], [], []],
                ['orders' => [$invalidOrder], $invalidOrder], $invalidOrder],
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyNeverInvoked('printReceipt');
    }

    public function testWithSomeValidSeatData()
    {
        $calledWith = [];
        $this->printServiceMock = test::double(PrintService::class, ['printReceipt' => function($params) use (&$calledWith) {
            array_push($calledWith, $params);
        }]);
        $invalidOrder = ['id' => $this->invalidOrderId];
        $seatWithInvalidOrders = ['orders' => [$invalidOrder, $invalidOrder]];
        $seatsWithValidOrders = [
            ['orders' => [['id' => 7], ['id' => 8]]],
            ['orders' => [['id' => 10]]],
        ];
        $payload = [
            'seat' => [
                $seatWithInvalidOrders,
                ['orders' => []],
                array_merge_recursive($seatsWithValidOrders[0], $seatWithInvalidOrders),
                ['orders' => [$invalidOrder]],
                ['orders' => []],
                array_merge_recursive($seatWithInvalidOrders, $seatsWithValidOrders[1]),
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyInvokedMultipleTimes('printReceipt', count($seatsWithValidOrders));
        $this->assertEquals($seatsWithValidOrders, $calledWith);
    }

    public function testSingleSeatWithInvalidOrders()
    {
        $invalidOrder = ['id' => $this->invalidOrderId];
        $payload = [
            'seat' => [
                'orders' => [
                    [], [], [],
                    $invalidOrder,
                    $invalidOrder,
                    $invalidOrder
                ]
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyNeverInvoked('printReceipt');
    }

    public function testSingleSeatWithSomeValidOrders()
    {
        $invalidOrder = ['id' => $this->invalidOrderId];
        $validOrders = [
            ['id' => 7],
            ['id' => 8],
            ['id' => 10]
        ];
        $payload = [
            'seat' => [
                'orders' => [
                    $validOrders[0],
                    $validOrders[1],
                    [], [], [],
                    $invalidOrder,
                    $invalidOrder,
                    $invalidOrder,
                    $validOrders[2],
                ]
            ]
        ];

        $this->postJson('/api/tables/seat/print', $payload)->assertSuccessful(200);
        $this->printServiceMock->verifyInvokedOnce('printReceipt', [
            ['orders' => $validOrders],
            null,
            ['combined' => false]
        ]);
    }
}

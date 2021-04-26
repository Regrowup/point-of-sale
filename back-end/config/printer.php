<?php

return [
  'thermal' => env('THERMAL_PRINTER_IP'),
  'impact' => env('IMPACT_PRINTER_IP'),
  'receipt_width' => env('RECEIPT_WIDTH'),
  'mock' => env('MOCK', false)
];

<?php
include __DIR__.'/../bootstrap/autoload.php';

$kernel = \AspectMock\Kernel::getInstance();
$kernel->init([
    'debug' => true,
    'includePaths' => [__DIR__.'/../vendor/laravel', __DIR__.'/../app'],
    'cacheDir' => '/tmp/pos-api'
]);

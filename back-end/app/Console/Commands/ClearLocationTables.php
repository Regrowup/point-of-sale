<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Location;
use App\Table;

class ClearLocationTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:LocationTables';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove any tables associated with locations; close all open tables.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $locationsWithTables = Location::has('table')->get();
        foreach ($locationsWithTables as $location) {
            $location->table()->dissociate();
            $location->saveOrFail();
        }
    }
}

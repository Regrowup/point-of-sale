<?php

use Illuminate\Database\Seeder;
use App\Server;

class ServersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $servers = [
            ['name' => 'Nathalie', 'is_admin' => false, 'pin' => '34'],
            ['name' => 'Caitlin', 'is_admin' => false, 'pin' => '63'],
            ['name' => 'Barbara', 'is_admin' => false, 'pin' => '80'],
            ['name' => 'Kira', 'is_admin' => false, 'pin' => '88'],
            ['name' => 'Zsuzsanna', 'is_admin' => false, 'pin' => '17'],
            ['name' => 'Aniko', 'is_admin' => true, 'pin' => '70'],
            ['name' => 'Robert', 'is_admin' => true, 'pin' => '94'],
            ['name' => 'Zoltan', 'is_admin' => true, 'pin' => '13']
        ];
        
        foreach($servers as $server) {
            Server::create($server);
        }
    }
}

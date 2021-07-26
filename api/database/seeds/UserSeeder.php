<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        // Create primary user account for testing.
        User::create([
            'name' => 'Dixan',
            'email' => 'dixan.sant@gmail.com',
            'roles' => 'ADMIN,CLIENT',
            'lang' => 'en',
            'password' => bcrypt('password')
        ]);

        User::create([
            'name' => 'Doug',
            'email' => 'madory@gmail.com',
            'roles' => 'ADMIN,CLIENT',
            'lang' => 'en',
            'password' => bcrypt('password')
        ]);

        User::create([
            'name' => 'Garrett',
            'email' => 'garrett@kentik.com',
            'roles' => 'ADMIN,CLIENT',
            'lang' => 'en',
            'password' => bcrypt('password')
        ]);

        // Create another five user accounts.

        $this->command->info('Users table seeded.');
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin PensMate',
            'nrp' => '0123456789', 
            'email' => 'admin@student.pens.ac.id',
            'password' => Hash::make('password123'), 
            'role' => 'admin',
            'status' => 'active',
            'ktm_image_path' => null, 
        ]);
    }
}
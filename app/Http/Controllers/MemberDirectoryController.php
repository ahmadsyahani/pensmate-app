<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberDirectoryController extends Controller
{
    /**
     * Menampilkan daftar member PensMate yang aktif
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $members = User::where('role', 'member')
            ->where('status', 'active')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nrp', 'like', "%{$search}%");
                });
            })
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Member/PensMates', [
            'members' => $members,
            'filters' => [
                'search' => $search
            ]
        ]);
    }
}

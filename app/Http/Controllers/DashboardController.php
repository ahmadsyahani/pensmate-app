<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Mengambil semua event berurutan berdasarkan tanggal terdekat
        $events = Event::with(['rundowns' => function($query) {
            $query->orderBy('time_start', 'asc');
        }])->orderBy('event_date', 'asc')->get();

        if ($user->role === 'admin') {
            // Statistik Khusus Admin (Dinamis dari Database)
            $totalMembers = User::where('role', 'member')->where('status', 'active')->count();
            $pendingMembers = User::where('role', 'member')->where('status', 'pending')->count();

            return Inertia::render('Admin/Dashboard', [
                'events' => $events,
                'stats' => [
                    'total_members' => $totalMembers,
                    'pending_members' => $pendingMembers,
                ]
            ]);
        } else {
            // Statistik Khusus Member (Kehadiran Pribadi)
            $attendanceCount = Attendance::where('user_id', $user->id)
                ->where('status', 'hadir')
                ->count();

            return Inertia::render('Member/Dashboard', [
                'events' => $events,
                'stats' => [
                    'attendance_count' => $attendanceCount,
                ]
            ]);
        }
    }
}
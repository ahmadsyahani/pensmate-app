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

        // Mengambil event berdasarkan tanggal terdekat
        $today = \Carbon\Carbon::now()->startOfDay();

        $upcomingEvents = Event::with(['rundowns' => function($query) {
            $query->orderBy('time_start', 'asc');
        }])->whereDate('event_date', '>=', $today)
           ->orderBy('event_date', 'asc')
           ->get();

        $pastEvents = Event::with(['rundowns' => function($query) {
            $query->orderBy('time_start', 'asc');
        }])->whereDate('event_date', '<', $today)
           ->orderBy('event_date', 'desc')
           ->get();

        if ($user->role === 'admin') {
            // Statistik Khusus Admin (Dinamis dari Database)
            $totalMembers = User::where('role', 'member')->where('status', 'active')->count();
            $pendingMembers = User::where('role', 'member')->where('status', 'pending')->count();

            // Tetap menggunakan events untuk kompatibilitas Admin/Dashboard sebelumnya
            $allEvents = Event::with(['rundowns' => function($query) {
                $query->orderBy('time_start', 'asc');
            }])->orderBy('event_date', 'asc')->get();

            return Inertia::render('Admin/Dashboard', [
                'events' => $allEvents,
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
                'upcoming_events' => $upcomingEvents,
                'past_events' => $pastEvents,
                'stats' => [
                    'attendance_count' => $attendanceCount,
                ]
            ]);
        }
    }
}
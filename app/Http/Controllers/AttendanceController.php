<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\Event;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman Kehadiran member
     */
    public function index()
    {
        $user = Auth::user();

        // Ambil semua event beserta status kehadiran user saat ini
        $events = Event::with(['rundowns' => function ($query) {
            $query->orderBy('time_start', 'asc');
        }])
        ->orderBy('event_date', 'desc')
        ->get()
        ->map(function ($event) use ($user) {
            $attendance = Attendance::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->first();

            $event->attendance_status = $attendance ? $attendance->status : null;
            $event->attended_at = $attendance ? $attendance->attended_at->format('Y-m-d H:i:s') : null;
            return $event;
        });

        // Riwayat kehadiran lengkap user ini
        $history = Attendance::with('event')
            ->where('user_id', $user->id)
            ->orderBy('attended_at', 'desc')
            ->get();

        return Inertia::render('Member/Kehadiran', [
            'events'  => $events,
            'history' => $history,
        ]);
    }

    /**
     * Memproses token presensi mandiri member (6 digit)
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'token'    => 'required|string|size:6',
        ]);

        $event = Event::findOrFail($request->event_id);
        $user  = Auth::user();

        // Cek jika sudah hadir sebelumnya
        $existing = Attendance::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->first();

        if ($existing) {
            return redirect()->back()->withErrors([
                'token' => 'Anda sudah melakukan presensi pada event ini!'
            ]);
        }

        // Cari sesi token aktif yang cocok untuk event ini
        $session = AttendanceSession::where('token', strtoupper(trim($request->token)))
            ->where('event_id', $event->id)
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return redirect()->back()->withErrors([
                'token' => 'Token tidak valid, sudah kedaluwarsa, atau tidak sesuai dengan event ini!'
            ]);
        }

        // Catat Kehadiran
        Attendance::create([
            'user_id'     => $user->id,
            'event_id'    => $event->id,
            'attended_at' => now(),
            'status'      => 'hadir',
        ]);

        return redirect()->back()->with('success', 'Presensi berhasil dicatat! Selamat mengikuti acara 🎉');
    }
}

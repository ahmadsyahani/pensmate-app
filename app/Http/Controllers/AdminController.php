<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Menampilkan halaman list user yang masih pending
     */
    public function index()
    {
        $pendingUsers = User::where('status', 'pending')
                            ->orderBy('created_at', 'desc')
                            ->get();

        return Inertia::render('Admin/Approval', [
            'pendingUsers' => $pendingUsers
        ]);
    }

    /**
     * Action untuk menyetujui user (Approve)
     */
    public function approve($id)
    {
        $user = User::findOrFail($id);
        
        $user->update(['status' => 'active']);

        return redirect()->back()->with('success', 'Mahasiswa berhasil di-approve!');
    }

    /**
     * Action untuk menolak user (Reject)
     */
    public function reject($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Pendaftaran ditolak, data dihapus!');
    }

    /**
     * Menampilkan halaman manajemen sesi token absensi
     */
    public function sessionPage()
    {
        $events = \App\Models\Event::orderBy('event_date', 'desc')->get();

        // Ambil semua sesi token beserta relasi event, diurutkan terbaru
        $sessions = AttendanceSession::with('event')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($session) {
                return [
                    'id'         => $session->id,
                    'event_id'   => $session->event_id,
                    'event_title'=> $session->event->title ?? '-',
                    'token'      => $session->token,
                    'expires_at' => $session->expires_at->toIso8601String(),
                    'is_active'  => $session->is_active,
                    'is_valid'   => $session->isValid(),
                    'created_at' => $session->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Admin/Scan', [
            'events'   => $events,
            'sessions' => $sessions,
        ]);
    }

    /**
     * Generate token 6 digit baru untuk sebuah event
     */
    public function generateToken(Request $request)
    {
        $request->validate([
            'event_id'        => 'required|exists:events,id',
            'duration_minutes' => 'required|integer|min:10|max:480',
        ]);

        // Nonaktifkan sesi lama yang masih aktif untuk event yang sama
        AttendanceSession::where('event_id', $request->event_id)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        // Generate token unik 6 digit
        do {
            $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (AttendanceSession::where('token', $token)->where('is_active', true)->exists());

        $session = AttendanceSession::create([
            'event_id'    => $request->event_id,
            'created_by'  => Auth::id(),
            'token'       => $token,
            'expires_at'  => now()->addMinutes($request->duration_minutes),
            'is_active'   => true,
        ]);

        return redirect()->back()->with('success', 'Token berhasil dibuat: ' . $token);
    }

    /**
     * Nonaktifkan token sesi absensi
     */
    public function deactivateToken($id)
    {
        $session = AttendanceSession::findOrFail($id);
        $session->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Sesi token berhasil dinonaktifkan.');
    }
}
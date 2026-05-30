<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RundownController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\MemberDirectoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; 
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/waiting-approval', function () {
        // Pengecekan status
        if (request()->user()->status === 'active') {
            
            // 1. Log out usernya
            Auth::guard('web')->logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            // 2. Redirect ke halaman login bawa pesan sukses
            return redirect()->route('login')->with('status', 'Selamat kamu berhasil lolos seleksi berkas, selanjutnya silahkan login untuk masuk ke aplikasi.');
        }
        
        return Inertia::render('WaitingApproval');
    })->name('approval.waiting');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'active.user'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'is.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/approval', [AdminController::class, 'index'])->name('approval');
    Route::post('/approve/{id}', [AdminController::class, 'approve'])->name('approve');
    Route::post('/reject/{id}', [AdminController::class, 'reject'])->name('reject');

    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::put('/events/{id}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');

    Route::post('/events/{eventId}/rundowns', [RundownController::class, 'store'])->name('rundowns.store');
    Route::put('/rundowns/{id}', [RundownController::class, 'update'])->name('rundowns.update');
    Route::delete('/rundowns/{id}', [RundownController::class, 'destroy'])->name('rundowns.destroy');

    Route::get('/session', [AdminController::class, 'sessionPage'])->name('session.index');
    Route::post('/session/generate', [AdminController::class, 'generateToken'])->name('session.generate');
    Route::post('/session/{id}/deactivate', [AdminController::class, 'deactivateToken'])->name('session.deactivate');
});

Route::middleware(['auth', 'active.user'])->group(function () {
    Route::get('/kehadiran', [AttendanceController::class, 'index'])->name('kehadiran.index');
    Route::post('/kehadiran', [AttendanceController::class, 'store'])->name('kehadiran.store');
    Route::get('/pensmates', [MemberDirectoryController::class, 'index'])->name('pensmates.index');
});

require __DIR__.'/auth.php';
<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Menampilkan daftar semua event di halaman admin
     */
    public function index()
    {
        $events = Event::orderBy('event_date', 'asc')
                       ->orderBy('start_time', 'asc')
                       ->get();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events
        ]);
    }

    /**
     * Menyimpan event baru ke database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:255',
        ]);

        Event::create($validated);

        return redirect()->back()->with('success', 'Event baru berhasil ditambahkan!');
    }

    /**
     * Memperbarui data event yang sudah ada
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:255',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event berhasil diperbarui!');
    }

    public function show($id)
    {
        // Ambil data event beserta relasi rundowns dan attendances (dengan info user)
        $event = Event::with([
            'rundowns' => function($query) {
                $query->orderBy('time_start', 'asc');
            },
            'attendances.user' => function($query) {
                $query->orderBy('name', 'asc');
            }
        ])->findOrFail($id);

        return Inertia::render('Admin/Events/Show', [
            'event' => $event
        ]);
    }

    /**
     * Menghapus event dari database
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->back()->with('success', 'Event berhasil dihapus!');
    }
}
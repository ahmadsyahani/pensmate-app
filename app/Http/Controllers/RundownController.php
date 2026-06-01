<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Rundown;
use Illuminate\Http\Request;

class RundownController extends Controller
{
    /**
     * Menyimpan rundown baru ke sebuah event.
     * Hanya diizinkan saat event belum mulai (upcoming).
     */
    public function store(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);

        if (! $event->can_edit) {
            abort(403, 'Rundown tidak dapat diubah saat event sedang berlangsung atau sudah selesai.');
        }

        $validated = $request->validate([
            'time_start' => 'required',
            'time_end'   => 'required|after:time_start',
            'activity'   => 'required|string|max:255',
            'pic'        => 'nullable|string|max:255',
        ]);

        $validated['event_id'] = $eventId;

        Rundown::create($validated);

        return redirect()->back()->with('success', 'Rundown berhasil ditambahkan!');
    }

    /**
     * Memperbarui data rundown.
     * Hanya diizinkan saat event belum mulai (upcoming).
     */
    public function update(Request $request, $id)
    {
        $rundown = Rundown::with('event')->findOrFail($id);

        if (! $rundown->event->can_edit) {
            abort(403, 'Rundown tidak dapat diubah saat event sedang berlangsung atau sudah selesai.');
        }

        $validated = $request->validate([
            'time_start' => 'required',
            'time_end'   => 'required|after:time_start',
            'activity'   => 'required|string|max:255',
            'pic'        => 'nullable|string|max:255',
        ]);

        $rundown->update($validated);

        return redirect()->back()->with('success', 'Rundown berhasil diperbarui!');
    }

    /**
     * Menghapus rundown.
     * Hanya diizinkan saat event belum mulai (upcoming).
     */
    public function destroy($id)
    {
        $rundown = Rundown::with('event')->findOrFail($id);

        if (! $rundown->event->can_edit) {
            abort(403, 'Rundown tidak dapat dihapus saat event sedang berlangsung atau sudah selesai.');
        }

        $rundown->delete();

        return redirect()->back()->with('success', 'Rundown berhasil dihapus!');
    }
}
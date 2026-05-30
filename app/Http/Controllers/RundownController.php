<?php

namespace App\Http\Controllers;

use App\Models\Rundown;
use Illuminate\Http\Request;

class RundownController extends Controller
{
    /**
     * Menyimpan rundown baru ke sebuah event
     */
    public function store(Request $request, $eventId)
    {
        $validated = $request->validate([
            'time_start' => 'required',
            'time_end' => 'required|after:time_start', // Validasi waktu selesai harus setelah waktu mulai
            'activity' => 'required|string|max:255',
            'pic' => 'nullable|string|max:255',
        ]);

        // Tambahkan event_id ke dalam array data yang akan disimpan
        $validated['event_id'] = $eventId;

        Rundown::create($validated);

        return redirect()->back()->with('success', 'Rundown berhasil ditambahkan!');
    }

    /**
     * Memperbarui data rundown
     */
    public function update(Request $request, $id)
    {
        $rundown = Rundown::findOrFail($id);

        $validated = $request->validate([
            'time_start' => 'required',
            'time_end' => 'required|after:time_start',
            'activity' => 'required|string|max:255',
            'pic' => 'nullable|string|max:255',
        ]);

        $rundown->update($validated);

        return redirect()->back()->with('success', 'Rundown berhasil diperbarui!');
    }

    /**
     * Menghapus rundown
     */
    public function destroy($id)
    {
        $rundown = Rundown::findOrFail($id);
        $rundown->delete();

        return redirect()->back()->with('success', 'Rundown berhasil dihapus!');
    }
}
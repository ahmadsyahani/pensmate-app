<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'event_date', 'start_time', 'end_time', 'location'])]
class Event extends Model
{
    use HasFactory;

    protected $appends = ['status', 'can_edit'];

    // Relasi: 1 Event punya banyak Rundown
    public function rundowns(): HasMany
    {
        return $this->hasMany(Rundown::class);
    }

    // Relasi: 1 Event punya banyak Attendance
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Status event: upcoming | ongoing | ended
     *
     * upcoming  → sebelum hari H, atau hari H sebelum start_time (masih persiapan)
     * ongoing   → hari H, antara start_time s/d end_time
     * ended     → setelah end_time di hari H, atau hari sesudah event
     */
    public function getStatusAttribute(): string
    {
        $tz  = 'Asia/Jakarta';
        $now = Carbon::now($tz);

        // Gabungkan event_date + start_time / end_time menjadi Carbon datetime
        $start = Carbon::parse($this->event_date . ' ' . $this->start_time, $tz);
        $end   = Carbon::parse($this->event_date . ' ' . $this->end_time,   $tz);

        if ($now->lt($start)) {
            return 'upcoming';
        }

        if ($now->between($start, $end)) {
            return 'ongoing';
        }

        return 'ended';
    }

    /**
     * Apakah admin boleh menambah / mengubah rundown?
     * Hanya diizinkan saat event belum mulai (upcoming).
     */
    public function getCanEditAttribute(): bool
    {
        return $this->status === 'upcoming';
    }
}
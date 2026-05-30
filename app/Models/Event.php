<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'event_date', 'start_time', 'end_time', 'location'])]
class Event extends Model
{
    use HasFactory;

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
}
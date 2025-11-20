<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'organizer_university_id',
        'event_title',
        'event_description',
        'event_image'
    ];
}

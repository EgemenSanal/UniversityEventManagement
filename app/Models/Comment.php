<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = "comments";

    protected $fillable = [
        'user_id',
        'event_id',
        'comment',
    ];
    public function user()
{
    return $this->belongsTo(User::class);
}
}

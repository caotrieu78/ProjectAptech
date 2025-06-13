<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'Feedback';
    protected $primaryKey = 'FeedbackID';
    public $timestamps = false;

    protected $fillable = [
        'Name',
        'Email',
        'Message',
        'SubmittedAt',
    ];

    protected $casts = [
        'SubmittedAt' => 'datetime',
    ];
}

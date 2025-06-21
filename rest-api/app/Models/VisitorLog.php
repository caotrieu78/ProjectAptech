<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    protected $table = 'VisitorLog';
    protected $primaryKey = 'VisitID';
    public $timestamps = false;

    protected $fillable = ['IPAddress', 'VisitTime', 'Location', 'UserID'];
    protected $casts = ['VisitTime' => 'datetime'];
}
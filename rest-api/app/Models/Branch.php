<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $table = 'Branch';
    protected $primaryKey = 'BranchID';
    public $timestamps = false;

    protected $fillable = [
        'BranchName',
        'Address',
        'City',
        'Latitude',
        'Longitude',
        'Phone',
        'Email',
    ];
}

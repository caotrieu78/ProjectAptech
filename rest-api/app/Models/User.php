<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'Users';
    protected $primaryKey = 'UserID';
    public $timestamps = false;

    protected $fillable = [
        'Username',
        'Password',
        'Email',
        'FullName',
        'RoleID',
        'IsActive',
        'Avatar',
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    protected $casts = [
        'IsActive' => 'boolean',
        'CreatedAt' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'RoleID');
    }
}

<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'Users'; // tên bảng đúng theo CSDL
    protected $primaryKey = 'UserID'; // tên khóa chính

    public $timestamps = false; // vì bạn không có created_at, updated_at mặc định Laravel

    protected $fillable = [
        'Username',
        'Password',
        'Email',
        'FullName',
        'RoleID',
        'IsActive',
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    protected $casts = [
        'IsActive' => 'boolean',
        'CreatedAt' => 'datetime',
    ];

    /**
     * Override tên cột password (vì Laravel mặc định dùng 'password')
     */
    public function getAuthPassword()
    {
        return $this->Password;
    }

    /**
     * Mối quan hệ với bảng Roles
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'RoleID');
    }
}

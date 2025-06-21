<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'Orders';
    protected $primaryKey = 'OrderID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'OrderDate',
        'Status',
        'TotalAmount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'OrderID', 'OrderID');
    }
}
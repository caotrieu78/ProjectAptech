<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'OrderDetails';
    protected $primaryKey = 'OrderDetailID';
    public $timestamps = false;

    protected $fillable = [
        'OrderID',
        'VariantID',
        'Quantity',
        'Price'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'VariantID', 'VariantID');
    }
}
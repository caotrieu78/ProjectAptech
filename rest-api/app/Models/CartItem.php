<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'CartItems';
    protected $primaryKey = 'CartItemID'; // 👈 Cái này rất quan trọng
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'VariantID',
        'Quantity',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'VariantID', 'VariantID');
    }
}
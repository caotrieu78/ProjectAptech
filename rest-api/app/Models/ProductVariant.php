<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $table = 'ProductVariant';
    protected $primaryKey = 'VariantID';
    public $timestamps = false;

    protected $fillable = [
        'ProductID',
        'SizeID',
        'ColorID',
        'Price',
        'StockQuantity',
        'ImageURL'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID');
    }

    public function size()
    {
        return $this->belongsTo(Size::class, 'SizeID');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'ColorID');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'Product';

    protected $primaryKey = 'ProductID';

    public $timestamps = false;

    protected $fillable = [
        'ProductName',
        'Description',
        'Gender',
        'CategoryID',
        'ThumbnailURL',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'CategoryID');
    }
}

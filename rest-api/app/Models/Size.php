<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $table = 'Size';
    protected $primaryKey = 'SizeID';
    public $timestamps = false;
    protected $fillable = ['SizeName'];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'SizeID');
    }
}
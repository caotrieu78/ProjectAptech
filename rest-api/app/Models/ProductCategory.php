<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    protected $table = 'ProductCategory';
    protected $primaryKey = 'CategoryID';
    public $timestamps = false;

    protected $fillable = [
        'CategoryName',
    ];
}

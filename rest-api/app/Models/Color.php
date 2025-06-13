<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $table = 'Color';
    protected $primaryKey = 'ColorID';
    public $timestamps = false;
    protected $fillable = ['ColorName'];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'ColorID');
    }
}

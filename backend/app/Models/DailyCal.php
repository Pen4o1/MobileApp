<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyCal extends Model
{
    protected $table = 'daily_cal';
    protected $fillable = [
        'user_id',
        'date',
        'calories_consumed',
        'fat_consumed',
        'protein_consumed',
        'carbohydrate_consumed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

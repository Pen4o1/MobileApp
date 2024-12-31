<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealPlans extends Model
{

    protected $table = 'meal_plans';

    protected $fillable = [
        'user_id',
        'plan',  
    ];

    protected $casts = [
        'plan' => 'array',  
    ];

    public function user()
    {
        return $this->belongsTo(User::class);  
    }
}


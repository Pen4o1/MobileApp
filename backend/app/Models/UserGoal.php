<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGoal extends Model
{
    protected $table = 'user_goals';
    protected $fillable = [
        'user_id', 
        'activity_level', 
        'goal', 
        'caloric_target'
    ];
}

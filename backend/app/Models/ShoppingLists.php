<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingLists extends Model
{
    protected $table = 'shopping_lists';

    protected $fillable = [
        'user_id',
        'shopping_list',  
    ];

    protected $casts = [
        'shopping_list' => 'array',  
    ];

    public function user()
    {
        return $this->belongsTo(User::class);  
    }
}

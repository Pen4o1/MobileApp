<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class DailyMacrosController extends Controller
{
    public function storeCal(Request $request) {
        $validate = $request->validate([
            '*.consumed_cal' => 'required|numeric|min:1',
            '*.protein' => 'required|numeric|min:0',
            '*.fat' => 'required|numeric|min:0',
            '*.carbohydrate' => 'required|numeric|min:0'
        ]);

        $user = Auth::user();
        $date = Carbon::today();
    
        $dailyMacros = $user->daily_macros()->firstOrCreate(
            ['date' => $date],
            ['calories_consumed' => 0],
            ['fat_consumed' => 0],
            ['carbohydrate_consumed' => 0],
            ['protein_consumed' => 0],
        );
    
        foreach ($request->all() as $item) {
           $dailyMacros->calories_consumed += (int) $item['consumed_cal'];
           $dailyMacros->fat_consumed += (float) $item['fat'];
           $dailyMacros->carbohydrate_consumed += (float) $item['carbohydrate'];
           $dailyMacros->protein_consumed += (float) $item['protein'];
        }
    
        $dailyMacros->save();
    
        return response()->json([
            'message' => 'Calories saved successfully'
        ]);
    }

    public function getDailyMacros(Request $request) {
        $user = Auth::user();

        $date = Carbon::today();

        $dailyMacros = $user->daily_macros()
        ->where('date', $date)
        ->first();
        
        $goal = $user->goal()->value('caloric_target');

        return response()->json([
            'daily_calories' => $dailyMacros ? $dailyMacros->calories_consumed : 0,
            'fat_consumed' => $dailyMacros ? $dailyMacros->fat_consumed : 0,
            'protein_consumed' => $dailyMacros ? $dailyMacros->protein_consumed : 0,
            'carbohydrate_consumed' => $dailyMacros ? $dailyMacros->carbohydrate_consumed : 0,
            'goal' => $goal,
        ]);
    }
}

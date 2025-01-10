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
            'consumed_cal' => 'required|numeric|min:1',
        ]);
        
        if($validate)
        {
            return response()->json(['error' => 'Invalid request'], 400);
        }

        $user = Auth::user();
        $date = Carbon::today();
    
        $dailyMacros = $user->daily_macros()->firstOrCreate(
            ['date' => $date],
            ['calories_consumed' => 0] 
        );
    
        $dailyMacros->calories_consumed += $validate['consumed_cal'];
        $dailyMacros->save();
    
        return response()->json([
            'message' => 'Calories saved successfully'
        ]);
    }
    
    public function getDailyCal(Request $request) {
        $user = Auth::user();

        $date = Carbon::today();

        $dailyCalories = $user->daily_macros()
        ->where('date', $date)
        ->first();
        
        $goal = $user->goal()->value('caloric_target');

        return response()->json(['daily_calories' => $dailyCalories ? $dailyCalories->calories_consumed : 0, 'goal' => $goal]);
    }
}

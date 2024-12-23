<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DailyCal;
use Illuminate\Support\Facades\Auth;


class DailyMacrosController extends Controller
{
    public function storeCal(Request $request) {
        $validate = $request->validate([
            'consumend_cal' => 'required|numeric|min:1',
        ]);
        
        $user = Auth::user();

        $date = Carbon::today();

        $dailyMacros = DailyCalories::UpdateOrCreate([
            ['user_id' => $user->id, 'date' => $date],
            ['calories_consumed' => $validated['calories_consumed']]
        ]);  
        
        return response()->json([
            'message' => 'Calories saved successfully'
        ]);
    }
    
        public function getDailyCal(Request $request) {
            $user = Auth::user();

            $date = Carbon::today();

            $dailyCalories = DailyCal::where('user_id', $user->id)
            ->where('date', $date)
            ->first();
            
            $goal = $user->goal()->value('caloric_target');

            return response()->json(['daily_calories' => $dailyCalories ? $dailyCalories->calories_consumed : 0, 'goal' => $goal]);
        }
}

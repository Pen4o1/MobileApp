<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class GoalController extends Controller
{
    public function saveGoal(Request $request)
    {
        $validated = $request->validate([
            'activity_level' => 'required|string', 
            'goal' => 'required|string',          
        ]);

        $user = Auth::user();

        $weight = $user->weight;
        $height = $user->height;
        $birthdate = $user->birthdate;
        $gender = $user->gender; 
        
        $age = Carbon::parse($birthdate)->age;

        if (!$weight || !$height || !$age || !$gender) {
            return response()->json([
                'message' => 'User data (weight, height, age, gender) is incomplete.',
            ], 400);
        }

        $bmr = $this->calculateBMR($weight, $height, $age, $gender);

        $activityMultiplier = $this->getActivityMultiplier($validated['activity_level']);
        $maintenanceCalories = $bmr * $activityMultiplier;

        $calories = $this->adjustCaloriesForGoal($maintenanceCalories, $validated['goal']);

        $user->goal()->updateOrCreate(
            ['user_id' => $user->id], 
            [
                'activity_level' => $validated['activity_level'],
                'goal' => $validated['goal'],
                'calories' => $calories,
            ]
        );

        return response()->json([
            'message' => 'Goal saved successfully.',
            'calories' => $calories,
        ]);
    }

    private function calculateBMR($weight, $height, $age, $gender)
    {
        if ($gender === 'male') {
            return 10 * $weight + 6.25 * $height - 5 * $age + 5;
        } else { 
            return 10 * $weight + 6.25 * $height - 5 * $age - 161;
        }
    }

    private function getActivityMultiplier($activityLevel)
    {
        $multipliers = [
            'sedentary' => 1.2,
            'lightly_active' => 1.375,
            'moderately_active' => 1.55,
            'very_active' => 1.725,
            'extra_active' => 1.9,
        ];

        return $multipliers[$activityLevel] ?? 1.2; 
    }

    private function adjustCaloriesForGoal($maintenanceCalories, $goal)
    {
        if ($goal === 'lose') {
            return $maintenanceCalories - 0.2 * $maintenanceCalories; 
        } elseif ($goal === 'gain') {
            return $maintenanceCalories + 0.2 * $maintenanceCalories; 
        }

        return $maintenanceCalories; 
    }
}

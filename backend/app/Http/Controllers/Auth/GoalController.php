<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GoalController extends Controller
{
    public function saveGoal(Request $request)
    {
        $validated = $request->validate([
            'activityLevel' => 'required|string|in:sedentary,lightly_active,moderately_active,very_active,extra_active',
            'goal' => 'required|string|in:maintain,lose,gain',
        ]);

        $activityLevel = $validated['activityLevel'];
        $goal = $validated['goal'];

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $weight = $user->kilos;
        $height = $user->height;
        $birthdate = $user->birthdate;
        $gender = $user->gender;

        if (!$weight || !$height || !$birthdate || !$gender) {
            return response()->json([
                'message' => 'User data (weight, height, birthdate, gender) is incomplete.',
            ], 400);
        }

        $age = Carbon::parse($birthdate)->age;

        // BMR (Basal Metabolic Rate) ny Mifflin-St Jeor
        $bmr = $this->calculateBMR($weight, $height, $age, $gender);
        // Activity multiplier based on activity level
        $activityMultiplier = $this->getActivityMultiplier($activityLevel);
        // Maintenance calories (BMR * activity multiplier)
        $maintenanceCalories = $bmr * $activityMultiplier;
        $calories = $this->adjustCaloriesForGoal($maintenanceCalories, $goal);

        $user->goal()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'activity_level' => $activityLevel,
                'goal' => $goal,
                'caloric_target' => $calories, 
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
            return $maintenanceCalories - 0.2 * $maintenanceCalories; // can change in the future based on how fast the user want to lose weight
        } elseif ($goal === 'gain') {
            return $maintenanceCalories + 0.2 * $maintenanceCalories; // can change in the future based on how fast the user want to gain weight
        }

        return $maintenanceCalories;
    }
}

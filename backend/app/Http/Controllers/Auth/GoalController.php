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
            'activity_level' => 'required|string', 
            'goal' => 'required|string',          
        ]);

        $user = Auth::user();

        if(!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        // Required fields for the user profile
        $requiredFields = ['weight', 'height', 'birthdate', 'gender'];
        $completedFields = [];
        $incompleteFields = [];
        $profileData = [];

        // Check which fields are completed or missing
        foreach ($requiredFields as $field) {
            if ($user->$field) {
                $completedFields[] = $field;
                $profileData[$field] = $user->$field;
            } else {
                $incompleteFields[] = $field;
            }
        }

        // Check if any required fields are incomplete
        if (count($incompleteFields) > 0) {
            return response()->json([
                'message' => 'User data ('.implode(', ', $incompleteFields).') is incomplete.',
            ], 400);
        }

        // Calculate age from birthdate
        $age = Carbon::parse($user->birthdate)->age;

        // Perform calculations only if the profile has all required data
        $bmr = $this->calculateBMR($user->weight, $user->height, $age, $user->gender);
        $activityMultiplier = $this->getActivityMultiplier($validated['activity_level']);
        $maintenanceCalories = $bmr * $activityMultiplier;
        $calories = $this->adjustCaloriesForGoal($maintenanceCalories, $validated['goal']);

        // Save or update the user's goal
        $user->goal()->updateOrCreate(
            ['user_id' => $user->id], 
            [
                'activity_level' => $validated['activity_level'],
                'goal' => $validated['goal'],
                'calories' => $calories,
            ]
        );

        // Log the goal update or creation
        Log::info('Goal updated or created', [
            'user_id' => $user->id,
            'activity_level' => $validated['activity_level'],
            'goal' => $validated['goal'],
            'calories' => $calories,
        ]);

        // Return the response
        return response()->json([
            'message' => 'Goal saved successfully.',
            'calories' => $calories,
        ]);
    }

    // Calculate Basal Metabolic Rate (BMR)
    private function calculateBMR($weight, $height, $age, $gender)
    {
        if ($gender === 'male') {
            return 10 * $weight + 6.25 * $height - 5 * $age + 5;
        } else { 
            return 10 * $weight + 6.25 * $height - 5 * $age - 161;
        }
    }

    // Get the activity multiplier based on activity level
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

    // Adjust calories based on the goal (lose, gain, or maintain)
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

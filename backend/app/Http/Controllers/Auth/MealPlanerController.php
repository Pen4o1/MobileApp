<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Model\MealPlan;

class MealPlanerController extends Controller
{
    public function generateMealPlan(Request $request)
    {
        $validated = $request->validate([
            'meals_per_day' => 'required|integer|min:1|max:6',
        ]);

        if(!$validated['meals_per_day']) {
            return response()->json(['error' => 'Meals per day is required'], 400);
        }

        $user = Auth::user();

        if (!$user || !$user->calorie_goal) {
            return response()->json(['error' => 'Calorie goal not set for the user'], 400);
        }

        $dailyCalories = $user->calorie_goal; 
        $mealsPerDay = $validated['meals_per_day'];

        $response = Http::withHeaders([
            'X-Api-Key' => config('services.api_ninjas.key'),
        ])->get('https://api.api-ninjas.com/v1/nutrition');

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch food data'], 500);
        }

        $foods = $response->json();

        $mealPlan = $this->generatePlan($foods, $dailyCalories, $mealsPerDay);

        $savedPlan = MealPlan::updateOrCreate(
            ['user_id' => $user->id],
            ['plan' => $mealPlan]
        );

        return response()->json([
            'message' => 'Meal plan generated successfully',
            'meal_plan' => $mealPlan,
        ]);
    }

    private function generatePlan($foods, $dailyCalories, $mealsPerDay)
    {
        $plan = [];
        $mealCalories = $dailyCalories / $mealsPerDay; 

        foreach (range(1, $mealsPerDay) as $mealIndex) {
            $mealName = "Meal $mealIndex";
            $mealItems = [];
            $currentCalories = 0;

            foreach ($foods as $food) {
                if ($currentCalories + $food['calories'] <= $mealCalories) {
                    $mealItems[] = $food;
                    $currentCalories += $food['calories'];
                }

                if ($currentCalories >= $mealCalories) {
                    break;
                }
            }

            $plan[$mealName] = $mealItems;
        }

        return $plan;
    }


    public function getMealPlan(Request $request)
    {
        $user = $request->user();
        $mealPlan = MealPlan::where('user_id', $user->id)->first();

        if (!$mealPlan) {
            return response()->json(['error' => 'No meal plan found'], 404);
        }

        return response()->json(['meal_plan' => $mealPlan->plan]);
    }
}

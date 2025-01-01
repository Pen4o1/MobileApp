<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MealPlans;
use App\Services\FatSecretService;

class MealPlanerController extends Controller
{
    protected $fatSecretService;

    public function __construct(FatSecretService $fatSecretService)
    {
        $this->fatSecretService = $fatSecretService;
    }

    public function generateMealPlan(Request $request)
    {
        $mealsPerDay = $request->input('meals_per_day');

        if (!in_array($mealsPerDay, [1, 2, 3, 4, 5, 6])) {
            return response()->json(['error' => 'Meals per day must be between 1 and 6'], 400);
        }

        $user = Auth::user();

        if (!$user || !$user->goal()->value('caloric_target')) {
            return response()->json(['error' => 'Calorie goal not set for the user'], 400);
        }

        $dailyCalories = $user->goal()->value('caloric_target'); 

        $mealCalories = $dailyCalories / $mealsPerDay;

        $caloriesFrom = $mealCalories * 0.5;
        $caloriesTo = $mealCalories * 1.5; 

        \Log::info("Calories per meal: " . $mealCalories);

        try {
            $mealPlan = $this->getMealByCalories($caloriesFrom, $caloriesTo);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error generating meal plan: ' . $e->getMessage()], 500);
        }

        $user->meal_plan()->updateOrCreate(
            ['user_id' => $user->id],
            ['plan' => $mealPlan]
        );

        return response()->json([
            'message' => 'Meal plan generated successfully',
            'meal_plan' => $mealPlan,
        ]);
    }

    private function getMealByCalories($caloriesFrom, $caloriesTo)
    {
        try {
            // Fetch recipes using FatSecretService
            $recipes = $this->fatSecretService->searchRecipes('meal', [
                'calories.from' => max(0, $caloriesFrom),
                'calories.to' => $caloriesTo,
            ]);
    
            // Normalize the response to handle single or multiple recipes
            $recipeList = $recipes['response']['recipes']['recipe'] ?? [];
            if (!is_array($recipeList)) {
                $recipeList = [$recipeList]; // Wrap single object in an array
            }
    
            // Filter recipes within the calorie range
            $filteredRecipes = array_filter($recipeList, function ($recipe) use ($caloriesFrom, $caloriesTo) {
                $calories = $recipe['recipe_nutrition']['calories'] ?? null;
                return $calories !== null && $calories >= $caloriesFrom && $calories <= $caloriesTo;
            });
    
            if (empty($filteredRecipes)) {
                \Log::warning("No recipes match the calorie criteria.", [
                    'calories_from' => $caloriesFrom,
                    'calories_to' => $caloriesTo,
                    'response' => $recipes,
                ]);
                return [];
            }
    
            return $filteredRecipes;
        } catch (\Exception $e) {
            \Log::error("Error fetching recipes: " . $e->getMessage(), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
            ]);
            return [];
        }
    }
    


    public function getMealPlan(Request $request)
    {
        $user = $request->user();
        $mealPlan = MealPlans::where('user_id', $user->id)->first();

        if (!$mealPlan) {
            return response()->json(['error' => 'No meal plan found'], 404);
        }

        return response()->json(['meal_plan' => $mealPlan->plan]);
    }
}

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
        $mealsPerDay = $request->input('meals_per_day', 3); 

        if (!in_array($mealsPerDay, [ 3, 4, 5, 6])) {
            return response()->json(['error' => 'Meals per day must be between 3 and 6'], 400);
        }

        $user = Auth::user();

        if (!$user || !$user->goal()->value('caloric_target')) {
            return response()->json(['error' => 'Calorie goal not set for the user'], 400);
        }

        $dailyCalories = $user->goal()->value('caloric_target');
        $mealCalories = $dailyCalories / $mealsPerDay;

        $caloriesFrom = $mealCalories; 
        $caloriesTo = $mealCalories * 1.3;  

        try {
            $mealPlan = $this->getMealPlanByCalories($mealsPerDay, $caloriesFrom, $caloriesTo);

            $user->meal_plan()->updateOrCreate(
                ['user_id' => $user->id],
                ['plan' => $mealPlan]
            );

            return response()->json([
                'message' => 'Meal plan generated successfully',
                'meal_plan' => $mealPlan,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error generating meal plan: ' . $e->getMessage()], 500);
        }
    }

    private function getMealPlanByCalories($mealsPerDay, $caloriesFrom, $caloriesTo)
    {
        $mealPlan = [];
        $usedRecipeIds = []; 
        $caloriesFrom = intval(round($caloriesFrom));
        $caloriesTo = intval(round($caloriesTo));
        $filters = [
            'calories.from' => $caloriesFrom,
            'calories.to' => $caloriesTo,
            'sort_by' => 'caloriesPerServingAscending',
        ];

        $recipesResponse = $this->fatSecretService->searchRecipes('', $filters);

        \Log::info("Recipes fetched", ['recipesResponse' => $recipesResponse]);

        if (!isset($recipesResponse['recipes']['recipe']) || !is_array($recipesResponse['recipes']['recipe'])) {
            throw new \Exception('Invalid recipes data structure or no recipes found.');
        }

        //beacuse the recipe array is in the recipes 
        $recipes = $recipesResponse['recipes']['recipe']; 

        for ($i = 0; $i < $mealsPerDay; $i++) {
            \Log::info("Selecting recipe for meal " . ($i + 1), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
            ]);

            $recipeAdded = false;

            try {
                foreach ($recipes as $recipe) {
                    if (!isset($recipe['recipe_id'])) {
                        \Log::warning("Recipe missing 'recipe_id'", ['recipe' => $recipe]);
                        continue; 
                    }

                    if (!in_array($recipe['recipe_id'], $usedRecipeIds)) {
                        $mealPlan[] = $recipe;
                        $usedRecipeIds[] = $recipe['recipe_id'];
                        $recipeAdded = true;
                        break; 
                    }
                }

                
                if (!$recipeAdded && !empty($mealPlan)) {
                    $mealPlan[] = $mealPlan[array_rand($mealPlan)]; 
                    $recipeAdded = true;
                }
            } catch (\Exception $e) {
                \Log::error("Error adding recipe for meal " . ($i + 1), [
                    'message' => $e->getMessage(),
                    'calories_from' => $caloriesFrom,
                    'calories_to' => $caloriesTo,
                ]);
                continue; 
            }

            if (!$recipeAdded) {
                \Log::warning("No recipe found or reused for meal " . ($i + 1));
            }
        }

        if (empty($mealPlan)) {
            throw new \Exception('Unable to generate a meal plan. No suitable recipes found.');
        }

        return $mealPlan;
    }

    public function getMealPlan()
    {
        $user = Auth::user();
        $mealPlan = $user->meal_plan('user_id')->first();

        if (!$mealPlan) {
            return response()->json(['error' => 'No meal plan found'], 404);
        }

        return response()->json(['meal_plan' => $mealPlan->plan]);
    }
}

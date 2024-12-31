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
        $this->fatSecretService = $fatSecretService; // Inject the FatSecretService
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

        try {
            $mealPlan = $this->generateMealPlanForDay($mealCalories, $mealsPerDay);
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

    private function generateMealPlanForDay($mealCalories, $mealsPerDay)
    {
        $mealPlan = [];
    
        foreach (range(1, $mealsPerDay) as $mealIndex) {
            $mealName = "Meal $mealIndex";
            $mealItems = [];
            $currentCalories = 0;
    
            try {
                $recipes = $this->fatSecretService->searchRecipes('meal', [
                    'max_results' => $mealsPerDay, 
                    'calories.from' => $mealCalories * 0.7, 
                    'calories.to' => $mealCalories * 1.3,  
                ]);
    
                \Log::info('FatSecret API response for Meal ' . $mealIndex, ['response' => $recipes]);
    
                if (isset($recipes['response']['recipes']['recipe']) && is_array($recipes['response']['recipes']['recipe']) && count($recipes['response']['recipes']['recipe']) > 0) {
                    foreach ($recipes['response']['recipes']['recipe'] as $recipe) {
                        \Log::info('Processing recipe for Meal ' . $mealIndex, ['recipe' => $recipe]);
    
                        if ($currentCalories + $recipe['recipe_nutrition']['calories'] <= $mealCalories) {
                            $mealItems[] = $recipe;
                            $currentCalories += $recipe['recipe_nutrition']['calories'];
                        }
    
                        if ($currentCalories >= $mealCalories) {
                            break;
                        }
                    }
                } else {
                    // Handle case where no recipes are found
                    \Log::warning("No recipes found for meal $mealIndex or response format is incorrect.");
                    $fallbackFood = $this->fatSecretService->searchFoods('protein shake'); 
                    if (isset($fallbackFood['foods'][0])) {
                        $mealItems[] = $fallbackFood['foods'][0]; 
                        $currentCalories += $fallbackFood['foods'][0]['calories'];
                    }
                }
    
                // If no recipe met the calorie requirement, add a fallback food
                if ($currentCalories < $mealCalories) {
                    \Log::info("Fallback triggered for $mealName due to insufficient calories.");
                    $fallbackFood = $this->fatSecretService->searchFoods('protein shake'); 
                    if (isset($fallbackFood['foods'][0])) {
                        $mealItems[] = $fallbackFood['foods'][0]; 
                        $currentCalories += $fallbackFood['foods'][0]['calories'];
                    }
                }
            } catch (\Exception $e) {
                throw new \Exception("Error fetching recipes for meal $mealIndex: " . $e->getMessage());
            }
    
            \Log::info("Final meal for $mealName", ['mealItems' => $mealItems]);
    
            $mealPlan[$mealName] = $mealItems;
        }
    
        return $mealPlan;
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

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

        $caloriesFrom = $mealCalories * 0.8; 
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
        $caloriesFrom = intval(round($caloriesFrom));
        $caloriesTo = intval(round($caloriesTo));
        $filters = [
            'calories.from' => $caloriesFrom,
            'calories.to' => $caloriesTo,
            'sort_by' => 'caloriesPerServingAscending',
        ];
        
        $mealTypes = $this->getMealTypesForMealsPerDay($mealsPerDay);

        for ($i = 0; $i < $mealsPerDay; $i++) {
            \Log::info("Fetching recipes for meal " . ($i + 1), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
            ]);

            try {
                if($mealsPerDay == 3 || $mealsPerDay == 5) {
                    $filters['meal_type'] = $mealTypes;
                }

                // Fetch recipes using the filters
                $recipes = $this->fatSecretService->searchRecipes('meal', $filters);

                foreach ($recipes as $recipe) {
                        $mealPlan[] = $recipe;
                }
            } catch (\Exception $e) {
                \Log::error("Error fetching recipes for meal " . ($i + 1), [
                    'message' => $e->getMessage(),
                    'calories_from' => $caloriesFrom,
                    'calories_to' => $caloriesTo,
                ]);
                continue; 
            }
        }

        if (empty($mealPlan)) {
            throw new \Exception('Unable to generate a meal plan. No suitable recipes found.');
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

    private function getMealTypesForMealsPerDay($mealsPerDay)
    {
        // Define a mapping of mealsPerDay to specific meal types
        $mealTypes = [];

        switch ($mealsPerDay) {
            case 3:
                $mealTypes = ['Breakfast', 'Lunch', 'Main Dishes'];
                break;
            case 5:
                $mealTypes = ['Breakfast', 'Lunch', 'Main Dishes', 'Snacks', 'Snacks'];
                break;
            // Add more cases if needed
            default:
                // For any other number of meals, you could implement more logic if necessary
                break;
        }

        return $mealTypes;
    }
}
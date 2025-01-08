<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        if (!in_array($mealsPerDay, [3, 4, 5, 6])) {
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

        $recipes = $this->getRecipes($filters);

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

                    if (!isset($recipe['recipe_nutrition']['calories'])) {
                        \Log::warning("Recipe missing 'calories' key in 'recipe_nutrition'", ['recipe' => $recipe]);
                        continue;
                    }

                    $calories = intval($recipe['recipe_nutrition']['calories']);

                    if (!in_array($recipe['recipe_id'], $usedRecipeIds)) {
                        $mealPlan[] = $recipe;
                        $usedRecipeIds[] = $recipe['recipe_id'];
                        $recipeAdded = true;
                        break;
                    }
                }

                // If no single recipe was added, attempt to find combined recipes
                if (!$recipeAdded) {
                    \Log::info("No single recipe found for meal, attempting combined recipes.");
                    $newCaloriesFrom = intval(round($caloriesFrom / 2));
                    $newCaloriesTo = intval(round($caloriesTo / 2));
                    $additionalFilters = [
                        'calories.from' => $newCaloriesFrom,
                        'calories.to' => $newCaloriesTo,
                        'sort_by' => 'caloriesPerServingAscending',
                    ];
                    $additionalRecipes = $this->getRecipes($additionalFilters);

                    $combinedCalories = 0;
                    $selectedRecipes = [];

                    // Combine recipes to reach the calorie goal
                    while ($combinedCalories < $caloriesFrom && !empty($additionalRecipes)) {
                        foreach ($additionalRecipes as $additionalRecipe) {
                            if (!isset($additionalRecipe['recipe_id']) || !isset($additionalRecipe['recipe_nutrition']['calories'])) {
                                \Log::warning("Skipping invalid additional recipe", ['recipe' => $additionalRecipe]);
                                continue;
                            }

                            if (!in_array($additionalRecipe['recipe_id'], $usedRecipeIds)) {
                                $recipeCalories = intval($additionalRecipe['recipe_nutrition']['calories']);
                                $combinedCalories += $recipeCalories;
                                $selectedRecipes[] = $additionalRecipe;
                                $usedRecipeIds[] = $additionalRecipe['recipe_id'];

                                if ($combinedCalories >= $caloriesFrom && $combinedCalories <= $caloriesTo) {
                                    break;
                                }
                            }
                        }

                        // Break the loop if no more recipes can be added
                        if (empty($additionalRecipes)) {
                            break;
                        }
                    }

                    if ($combinedCalories >= $caloriesFrom && $combinedCalories <= $caloriesTo) {
                        $mealPlan[] = [
                            'combined_recipes' => $selectedRecipes,
                            'total_calories' => $combinedCalories,
                        ];
                        $recipeAdded = true;
                    }
                }

                // If still no recipe is found, reuse a random recipe from the plan
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

    /*
    THIS IS A TEST  with added limmit of attempts(5) and dynamic range adjustment

    private function getMealPlanByCalories($mealsPerDay, $caloriesFrom, $caloriesTo)
    {
        $mealPlan = [];
        $usedRecipeIds = [];
        $caloriesFrom = intval(round($caloriesFrom));
        $caloriesTo = intval(round($caloriesTo));

        for ($i = 0; $i < $mealsPerDay; $i++) {
            \Log::info("Selecting recipe for meal " . ($i + 1), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
            ]);

            $recipeAdded = false;
            $attempts = 0;

            while (!$recipeAdded && $attempts < 5) { // Limit attempts to prevent infinite loop
                $attempts++;
                try {
                    $filters = [
                        'calories.from' => $caloriesFrom,
                        'calories.to' => $caloriesTo,
                        'sort_by' => 'caloriesPerServingAscending',
                    ];
                    $recipes = $this->getRecipes($filters);

                    foreach ($recipes as $recipe) {
                        if (!isset($recipe['recipe_id']) || !isset($recipe['recipe_nutrition']['calories'])) {
                            \Log::warning("Skipping invalid recipe", ['recipe' => $recipe]);
                            continue;
                        }

                        if (!in_array($recipe['recipe_id'], $usedRecipeIds)) {
                            $mealPlan[] = $recipe;
                            $usedRecipeIds[] = $recipe['recipe_id'];
                            $recipeAdded = true;
                            break;
                        }
                    }

                    // If no single recipe found, attempt to combine recipes
                    if (!$recipeAdded) {
                        $combinedCalories = 0;
                        $selectedRecipes = [];
                        foreach ($recipes as $recipe) {
                            if (!in_array($recipe['recipe_id'], $usedRecipeIds)) {
                                $recipeCalories = intval($recipe['recipe_nutrition']['calories']);
                                $combinedCalories += $recipeCalories;
                                $selectedRecipes[] = $recipe;
                                $usedRecipeIds[] = $recipe['recipe_id'];

                                if ($combinedCalories >= $caloriesFrom) {
                                    break;
                                }
                            }
                        }

                        if ($combinedCalories >= $caloriesFrom && $combinedCalories <= $caloriesTo) {
                            $mealPlan[] = [
                                'combined_recipes' => $selectedRecipes,
                                'total_calories' => $combinedCalories,
                            ];
                            $recipeAdded = true;
                        }
                    }

                    // If still no recipe, reduce calorie range and retry
                    if (!$recipeAdded) {
                        $caloriesFrom = intval(round($caloriesFrom / 2));
                        $caloriesTo = intval(round($caloriesTo / 2));
                        \Log::info("Reducing calorie range to retry.", [
                            'calories_from' => $caloriesFrom,
                            'calories_to' => $caloriesTo,
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error("Error adding recipe for meal " . ($i + 1), [
                        'message' => $e->getMessage(),
                        'calories_from' => $caloriesFrom,
                        'calories_to' => $caloriesTo,
                    ]);
                    break;
                }
            }

            // Reuse a random meal if all attempts failed
            if (!$recipeAdded && !empty($mealPlan)) {
                $mealPlan[] = $mealPlan[array_rand($mealPlan)];
            }
        }

        if (empty($mealPlan)) {
            throw new \Exception('Unable to generate a meal plan. No suitable recipes found.');
        }

        return $mealPlan;
    }

    */


    private function getRecipes($filters)
    {
        $recipesResponse = $this->fatSecretService->searchRecipes('', $filters);

        \Log::info("Recipes fetched", ['recipesResponse' => $recipesResponse]);

        if (
            !isset($recipesResponse['recipes']['recipe']) ||
            !is_array($recipesResponse['recipes']['recipe']) ||
            empty($recipesResponse['recipes']['recipe'])
        ) {
            \Log::warning("No recipes found for filters", ['filters' => $filters]);
            return [];
        }

        return $recipesResponse['recipes']['recipe'];
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

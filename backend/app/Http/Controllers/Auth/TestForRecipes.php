<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MealPlans;
use App\Services\FatSecretService;

class TestForRecipes extends Controller
{
    protected $fatSecretService;

    public function __construct(FatSecretService $fatSecretService)
    {
        $this->fatSecretService = $fatSecretService;
    }

    public function getMeal(Request $request)
    {
        $caloriesFrom = 0;
        $caloriesTo = 1000;

        $additionalParams = [];

        $meals = $this->getMealByCalories($caloriesFrom, $caloriesTo, $additionalParams);

        if (!empty($meals)) {
            return response()->json(['meals' => $meals], 200);
        } else {
            return response()->json(['error' => 'No meals found for the specified calorie range'], 404);
        }
    }

    private function getMealByCalories($caloriesFrom, $caloriesTo, $additionalParams = [])
    {
        try {
            if ($caloriesFrom < 0 || $caloriesTo < 0) {
                throw new \InvalidArgumentException("Calories values must be non-negative.");
            }

            if ($caloriesFrom > $caloriesTo) {
                throw new \InvalidArgumentException("Calories 'from' must not be greater than 'to'.");
            }

            $params = [
                'calories.from' => max(0, $caloriesFrom),
                'calories.to' => $caloriesTo,
            ];

            if (!empty($additionalParams)) {
                $params = array_merge($params, $additionalParams);
            }

            $recipes = $this->fatSecretService->searchRecipes('meal', $params);

            $recipeList = $recipes['response']['recipes']['recipe'] ?? [];
            if (!is_array($recipeList)) {
                $recipeList = [$recipeList];
            }

            $filteredRecipes = array_filter($recipeList, function ($recipe) use ($caloriesFrom, $caloriesTo) {
                $calories = $recipe['recipe_nutrition']['calories'] ?? null;
                return $calories !== null && $calories >= $caloriesFrom && $calories <= $caloriesTo;
            });

            if (empty($filteredRecipes)) {
                \Log::warning("No recipes match the criteria.", [
                    'params' => $params,
                    'response' => $recipes,
                ]);
                return [];
            }

            return $filteredRecipes;
        } catch (\InvalidArgumentException $e) {
            \Log::error("Invalid argument error: " . $e->getMessage(), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
                'additional_params' => $additionalParams,
            ]);
            return []; 
        } catch (\Exception $e) {
            \Log::error("Error fetching recipes: " . $e->getMessage(), [
                'calories_from' => $caloriesFrom,
                'calories_to' => $caloriesTo,
                'additional_params' => $additionalParams,
            ]);
            return []; 
        }
    }
}

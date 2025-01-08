<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShoppingListController extends Controller
{
    public function getShoppingPlan()
    {
        $user = Auth::user();

        $mealPlan = $user->meal_plan()->value('plan');

        if (!$mealPlan) {
            return response()->json(['error' => 'No meal plan found'], 404);
        }

        $shoppingList = [];

        foreach ($mealPlan as $meal) {
            if (isset($meal['recipe_ingredients']['ingredient'])) {
                $this->processIngredients($meal['recipe_ingredients']['ingredient'], $shoppingList);
            } elseif (isset($meal['combined_recipes'])) {
                foreach ($meal['combined_recipes'] as $recipe) {
                    if (isset($recipe['recipe_ingredients']['ingredient'])) {
                        $this->processIngredients($recipe['recipe_ingredients']['ingredient'], $shoppingList);
                    }
                }
            }
        }

        $combinedIngredients = $this->combineIngredients($shoppingList);

        $user->shopping_list()->updateOrCreate(
            ['user_id' => $user->id],
            ['shopping_list' => $combinedIngredients]
        );

        return response()->json([
            'shopping_list' => $combinedIngredients,
        ]);
    }

    private function processIngredients(array $ingredients, array &$ingredientList)
    {
        foreach ($ingredients as $ingredient) {
            $ingredientList[] = $this->parseIngredient($ingredient);
        }
    }

    private function parseIngredient(string $ingredient)
    {
        // regex to extract quantity, unit if exists
        $pattern = '/^([\d\/.,\s]+)?\s*(\b(?:tsp|tbsp|cup|oz|g|ml|l|lb|kg)\b)?\s*(.*)$/i';
        if (preg_match($pattern, $ingredient, $matches)) {
            $quantity = $matches[1] ?? '';
            $unit = $matches[2] ?? '';
            $name = $matches[3] ?? $ingredient;

            return [
                'name' => trim(strtolower($name)),
                'quantity' => $this->convertQuantityToFloat($quantity),
                'unit' => $quantity && $unit ? strtolower($unit) : '',
            ];
        }

        return [
            'name' => trim(strtolower($ingredient)),
            'quantity' => 0,
            'unit' => '',
        ];
    }

    private function convertQuantityToFloat(string $quantity)
    {
        if (str_contains($quantity, '/')) {
            $parts = explode('/', $quantity);
            return count($parts) === 2 ? floatval($parts[0]) / floatval($parts[1]) : floatval($quantity);
        }

        return floatval(str_replace([' ', ','], '', $quantity));
    }

    private function combineIngredients(array $ingredientList)
    {
        $aggregated = [];

        foreach ($ingredientList as $ingredient) {
            $name = $ingredient['name'];
            $unit = $ingredient['unit'];

            if (!isset($aggregated[$name])) {
                $aggregated[$name] = [
                    'name' => $name,
                    'quantity' => 0,
                    'unit' => $unit,
                ];
            }

            if ($aggregated[$name]['unit'] === $unit || !$unit) {
                $aggregated[$name]['quantity'] += $ingredient['quantity'];
            } else {
                $convertedQuantity = $this->convertUnit($ingredient['quantity'], $ingredient['unit'], $aggregated[$name]['unit']);
                $aggregated[$name]['quantity'] += $convertedQuantity;
            }
        }

        return array_values($aggregated);
    }

    private function convertUnit($quantity, $fromUnit, $toUnit)
    {
        $conversionRates = [
            'tsp' => ['tbsp' => 1 / 3, 'cup' => 1 / 48],
            'tbsp' => ['tsp' => 3, 'cup' => 1 / 16],
            'cup' => ['tsp' => 48, 'tbsp' => 16],
            'oz' => ['g' => 28.3495],
            'g' => ['oz' => 1 / 28.3495],
        ];

        if (isset($conversionRates[$fromUnit][$toUnit])) {
            return $quantity * $conversionRates[$fromUnit][$toUnit];
        }

        return $quantity;
    }
}

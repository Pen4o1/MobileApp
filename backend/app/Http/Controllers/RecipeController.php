<?php

namespace App\Http\Controllers;

use App\Services\FatSecretService;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    protected $fatSecretService;

    public function __construct(FatSecretService $fatSecretService)
    {
        $this->fatSecretService = $fatSecretService;
    }

    public function search(Request $request)
    {
        $query = $request->input('query', ''); 
        $filters = [];

        if ($request->has('calories_from')) {
            $filters['calories.from'] = $request->input('calories_from');
        }
        if ($request->has('calories_to')) {
            $filters['calories.to'] = $request->input('calories_to');
        }
        if ($request->has('max_results')) {
            $filters['max_results'] = $request->input('max_results');
        }

        try {
            $recipes = $this->fatSecretService->searchRecipes($query, $filters);
            return response()->json($recipes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

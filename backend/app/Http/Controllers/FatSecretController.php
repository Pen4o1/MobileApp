<?php

namespace App\Http\Controllers;

use App\Services\FatSecretService;
use Illuminate\Http\Request;

class FatSecretController extends Controller
{
    protected $fatSecretService;

    public function __construct(FatSecretService $fatSecretService)
    {
        $this->fatSecretService = $fatSecretService;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }

        try {
            $result = $this->fatSecretService->searchFoods($query);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /*
    public function barcode(Request $request)
    {
        $barcode = $request->input('barcode');
        $result = $this->fatSecretService->getFoodDetails($barcode);
        return response()->json($result);
    }
    */
    
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FatSecretService
{
    private $clientId;
    private $clientSecret;
    private $apiUrl;
    private $tokenUrl;

    public function __construct()
    {
        $this->clientId = config('services.fatsecret.client_id');
        $this->clientSecret = config('services.fatsecret.client_secret');
        $this->apiUrl = config('services.fatsecret.api_url');
        $this->tokenUrl = config('services.fatsecret.token_url');
    }

    private function getAccessToken()
    {
        $response = Http::asForm()->post($this->tokenUrl, [
            'grant_type' => 'client_credentials',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'scope' => 'basic premier',
        ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception('Failed to retrieve access token: ' . $response->body());
    }

    public function searchFoods($query)
    {
        $token = $this->getAccessToken();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get($this->apiUrl, [
            'method' => 'foods.search.v3',
            'format' => 'json',
            'search_expression' => $query,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to search foods: ' . $response->body());
    }

    public function searchRecipes($query, $filters = [])
    {
        $token = $this->getAccessToken();

        $params = array_merge([
            'method' => 'recipes.search.v3',
            'search_expression' => $query,
            'format' => 'json',
            'max_results' => 50,
        ], $filters);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->get($this->apiUrl, $params);

            if ($response->successful()) {
                \Log::info('Recipe API Response:', ['response' => $response->json()]);
                return $response->json();
            }

            \Log::error('Recipe Search Failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Exception during Recipe Search:', ['message' => $e->getMessage()]);
        }

        throw new \Exception('Failed to search recipes.');
    }

    public function naturalLanguage($query)
    {
        $endpoint = 'natural-language-processing/v1';
        $url = rtrim($this->apiUrl, '/') . '/' . ltrim($endpoint, '/');

        $params = array_merge([
            'user_input' => $query,
            'language' => 'en',
            'include_food_data' => true,
            'max_results' => 50,
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
            'Content-Type' => 'application/json',
        ])->post($url, $params);

        if ($response->successful()) {
            \Log::info('API Response', $response->json()); // Log the full response
            return $this->transformResponse($response->json());
        }

        throw new \Exception('Error fetching foods: ' . $response->body());
    }

    private function transformResponse($data)
    {
        $items = [];
        foreach ($data['eaten_foods'] ?? [] as $food) {
            $items[] = [
                'id' => $food['food_id'],
                'name' => $food['food_name'],
                'calories' => $food['calories'] ?? 'Unknown',
            ];
        }
        return $items;
    }

    // Search recipes by recipe ID 
    public function getRecipeById($recipeId)
    {
        $token = $this->getAccessToken();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get($this->apiUrl, [
            'method' => 'recipes.get',
            'recipe_id' => $recipeId,
            'format' => 'json',
        ]);

        if ($response->successful()) {
            return $response->json(); 
        }

        throw new \Exception('Failed to fetch recipe details: ' . $response->body());
    }

    /* this is for barcodes 
    public function searchFoodsByBarcode($query)
    {
        $token = $this->getAccessToken();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get($this->apiUrl, [
            'method' => 'foods.find_id_for_barcode',
            'format' => 'json',
            'search_expression' => $query,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Failed to search foods: ' . $response->body());
    }
    */
}

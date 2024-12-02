<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;

Route::post('/register', [RegisterController::class, 'Register']);
Route::post('/validate-token', function (Request $request) {
    try {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'valid' => true,
            'user' => $user, 
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'valid' => false,
            'error' => $e->getMessage(),
        ], 401);
    }
});

Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});

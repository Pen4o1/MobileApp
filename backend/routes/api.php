<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProfileCompleteCotroller;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\JwtCookieMiddleware;
use App\Http\Controllers\Auth\GoalController;



Route::post('/register', [RegisterController::class, 'Register']);
Route::post('/login', [LoginController::class, 'Login']);

Route::post('/validate-token', function (Request $request) {
    try {
        $token = $request->cookie('jwt_token');

        if (!$token) {
            throw new \Exception('Token not provided');
        }

        $user = auth('api')->setToken($token)->user();

        if (!$user) {
            throw new \Exception('Invalid token or user not found');
        }

        return response()->json([
            'valid' => true,
            'user' => $user,
            'compleated' => $user->compleated,
        ]);

    } catch (\Exception $e) {
        Log::error("Token validation failed: " . $e->getMessage());

        return response()->json([
            'valid' => false,
            'error' => $e->getMessage(),
        ], 401);
    }
});

Route::middleware([JwtCookieMiddleware::class])->group(function () {
    Route::get('/profile-status', [ProfileCompleteCotroller::class, 'getProfileStatus']);
    Route::post('/update-profile', [ProfileCompleteCotroller::class, 'completeProfile']);
});

Route::middleware([JwtCookieMiddleware::class])->post('/save-goal', [GoalController::class, 'saveGoal']);



Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});

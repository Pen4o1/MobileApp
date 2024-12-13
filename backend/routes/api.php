<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProfileCompleteController;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;


Route::post('/register', [RegisterController::class, 'Register']);
Route::post('/login', [LoginController::class, 'Login']);

Route::post('/validate-token', function (Request $request) {
    try {
        $token = $request->cookie('jwt_token');
        if (!$token) {
            throw new \Exception('Token not provided');
        }
        $user = JWTAuth::setToken($token)->authenticate();
        return response()->json([
            'valid' => true,
            'user' => $user,
        ]);
    } catch (\Exception $e) {
        Log::error("Token validation failed: " . $e->getMessage());
        return response()->json(['valid' => false, 'error' => $e->getMessage()], 401);
    }
});

Route::middleware(['auth'])->group(function () {
    Route::get('/profile/status', [ProfileCompleteCotroller::class, 'getProfileStatus']);
    Route::post('/profile/complete', [ProfileCompleteCotroller::class, 'completeProfile']);
});

Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});

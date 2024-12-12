<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProfileCompleteController;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;

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
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['valid' => false, 'error' => 'Token has expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['valid' => false, 'error' => 'Invalid token'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['valid' => false, 'error' => 'Token is missing'], 401);
    } catch (\Exception $e) {
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

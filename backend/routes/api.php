<?php
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Middleware\SetCrossOriginHeaders;


Route::post('/register', [RegisterController::class, 'Register']);
Route::post('/auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::post('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});
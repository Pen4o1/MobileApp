<?php
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserInfoController;

Route::post('/user-details', [UserInfoController::class, 'store']);
Route::post('/register', [RegisterController::class, 'register']); 
Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});
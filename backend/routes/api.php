<?php
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'Register']);
Route::middleware(['auth:sanctum', \Fruitcake\Cors\HandleCors::class])->get('/user', function (Request $request) {
    return $request->user();
});
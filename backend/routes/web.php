<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\ProfileCompleteCotroller;
 

Route::get('/', function () {
    return view('welcome');
});

Route::controller(GoogleController::class)->group(function() {
    Route::get('auth/google', 'redirectToGoogle');
    Route::get('auth/callback', 'handleGoogleCallback');
});



Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});

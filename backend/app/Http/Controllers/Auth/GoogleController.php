<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth; 
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTException;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->scopes(['profile', 'https://www.googleapis.com/auth/user.birthday.read'])->stateless()->redirect();
    }

    /**
     * Handle the Google OAuth callback and retrieve user details.
     */
    public function handleGoogleCallback()
{
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();
        $user = User::firstOrCreate([
            'email' => $googleUser->getEmail(),
            'first_name' => $googleUser->user['given_name'] ?? $googleUser->getName(),
            'last_name' => $googleUser->user['family_name'] ?? '',
            'password' => NULL,
            'google_id' => $googleUser->getId(),
            'compleated' => false,
            'birthdate' => $googleUser->user['birthday'] ?? null,
        ]);

        Auth::login($user);

        // Generate a proper JWT
        $token = JWTAuth::fromUser($user, ['id', 'email']);

        // Store the token in a cookie
        $cookie = cookie(
            'jwt_token',
            $token,
            60,
            '/',
            null,
            true,
            true,
            false,
            'None'
        );

        return redirect()->away('http://localhost:8100/home')->cookie($cookie);

    } catch (\Exception $e) {
        return redirect()->route('login')->with('error', 'Unable to authenticate.');
    }
}


    public function user(Request $request)
    {
        return response()->json($request->userData());
    }

}
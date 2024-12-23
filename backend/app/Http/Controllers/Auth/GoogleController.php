<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth; 
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTException;
use Tymon\JWTAuth\Payload;
use Tymon\JWTAuth\Claims\Collection;
use Tymon\JWTAuth\Claims\Custom;



class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->scopes(['profile', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'])->stateless()->redirect();
    }

    /**
     * Handle the Google OAuth callback and retrieve user details.
     */
    public function handleGoogleCallback(Request $request)
{
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();
        
        $gender = $googleUser->user['gender'] ?? null;


        $user = User::updateOrCreate([
            'email' => $googleUser->getEmail(),
            'first_name' => $googleUser->user['given_name'] ?? $googleUser->getName(),
            'last_name' => $googleUser->user['family_name'] ?? '',
            'password' => NULL,
            'google_id' => $googleUser->getId(),
            'compleated' => false,
            'birthdate' => $googleUser->user['birthday'] ?? null,
            'gender' =>  $gender,
        ]);

        $token = JWTAuth::fromUser($user);

        \Log::info('Generated JWT Token: ' . $token);  

        $cookie = cookie(
            'jwt_token',
            $token,
            60,
            '/',
            null,
            true,               // Secure
            true,               // HttpOnly
            false,              // SameSite
            'None'
        );

        return redirect()->away('http://localhost:8100/home')->cookie($cookie);

    } catch (\Exception $e) {
        return redirect()->away('http://localhost:8100/login')->with('error', 'Unable to authenticate.');
    }
}



    public function user(Request $request)
    {
        return response()->json($request->userData());
    }

}
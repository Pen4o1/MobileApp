<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        $user = User::where('google_id', $googleUser->id)->first();
        
        $randPassword = Str::password(16, true, true, true, false);
        if ($user) {
            Auth::login($user);
            return redirect()->away('http://localhost:8100/home');
        } else {
            $userData = User::create([
                'email' => $googleUser->getEmail(),
                'first_name' => $googleUser->user['given_name'] ?? $googleUser->getName(),
                'last_name' => $googleUser->user['family_name'] ?? '',
                'password' => Hash::make($randPassword),
                'google_id' => $googleUser->getId(),
                'compleated' => false,
                'birthdate' => $googleUser->user['birthday'] ?? null,
            ]);

            Auth::login($userData);
            return redirect()->away('http://localhost:8100/home');
        }
    } catch (\Exception $e) {
        return redirect()->route('login')->with('error', 'Unable to authenticate. Please try again.');
    }
}

    public function user(Request $request)
    {
        return response()->json($request->userData());
    }

}
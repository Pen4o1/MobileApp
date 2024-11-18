<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        // Stateless is used to avoid session handling issues.
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle the Google OAuth callback and retrieve user details.
     * This method now only returns the user data.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('google_id', $googleUser->getId())->first();
            
            if ($user) {
                return response()->json([
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'google_id' => $user->google_id,
                ]);
            } else {
                $userData = User::firstOrCreate(
                    ['email' => $googleUser->getEmail()],
                    [
                        'first_name' => $googleUser->user['given_name'] ?? $googleUser->getName(),
                        'last_name' => $googleUser->user['family_name'] ?? '',
                        'password' => Hash::make('Password@1234'), 
                        'google_id' => $googleUser->getId(),
                    ]
                );
                
                return response()->json([
                    'id' => $userData->id,
                    'first_name' => $userData->first_name,
                    'last_name' => $userData->last_name,
                    'email' => $userData->email,
                    'google_id' => $userData->google_id,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Google login failed. Please try again.'], 400);
        }
    }

    /**
     * Fetch and return the authenticated user's data as JSON.
     */
    public function user(Request $request)
    {
        $user = Auth::user(); 

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        return response()->json([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'google_id' => $user->google_id,
        ]);
    }
}

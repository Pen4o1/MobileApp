<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use League\OAuth2\Client\Provider\Google;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;


class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the Google OAuth callback and retrieve user details.
     */
    public function handleGoogleCallback(Request $request)
    {
    $provider = new Google([
        'clientId' => env('GOOGLE_CLIENT_ID'),
        'clientSecret' => env('GOOGLE_CLIENT_SECRET'),
        'redirectUri' => env('GOOGLE_REDIRECT_URI'),
    ]);

    if (!$request->has('code') || $request->has('error')) {
        abort(403, 'Unauthorized');
    }

    $state = $request->get('state');
    if (empty($state) || $state !== session('oauth2state')) {
        abort(403, 'State mismatch');
    }

    try {
        $token = $provider->getAccessToken('authorization_code', [
            'code' => $request->get('code'),
        ]);

        $googleUser = $provider->getResourceOwner($token);

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'first_name' => $googleUser->getFirstName(),
                'last_name' => $googleUser->getLastName(),
                'google_id' => $googleUser->getId(),
            ]
        );

        $tokenResult = $user->createToken('GoogleAuthToken')->plainTextToken;
        
        return response()->json([
            'user' => [
                'first_name' => $googleUser->getFirstName(),
                'last_name' => $googleUser->getLastName(),
                'email' => $googleUser->getEmail(),
            ],
            'access_token' => $tokenResult,
            'token_type' => 'Bearer',
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Unable to authenticate'], 500);
    }
}


    /**
     * Get the authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}

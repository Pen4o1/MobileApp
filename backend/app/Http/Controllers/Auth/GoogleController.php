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
use Illuminate\Support\Facades\Http;
 


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

            $accessToken = $googleUser->token;

            \Log::info('Generated accesstoken Token: ' . $accessToken);  

            $response = Http::withToken($accessToken)->get('https://people.googleapis.com/v1/people/me', [
                'personFields' => 'birthdays,genders,names',
            ]);

            $additionalData = $response->json();

            $gender = collect($additionalData['genders'] ?? [])
            ->firstWhere('metadata.primary', true)['value'] ?? null;

            $birthdayData = collect($additionalData['birthdays'] ?? [])
                ->firstWhere('metadata.primary', true)['date'] ?? null;

            $birthdate = $birthdayData // to format the birthdate cause they are diff fields
                ? sprintf('%04d-%02d-%02d', $birthdayData['year'], $birthdayData['month'], $birthdayData['day'])
                : null;

                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    $compleated = $user->compleated;
        
                    if (!$compleated) {
                        $user->update([
                            'first_name' => $givenName ?? $googleUser->user['given_name'] ?? $googleUser->getName(),
                            'last_name' => $familyName ?? $googleUser->user['family_name'] ?? '',
                            'gender' => $gender,
                            'birthdate' => $birthdate,
                            'compleated' => $user->compleated,
                        ]);
                    }
                } else {
                    $user = User::create([
                        'email' => $googleUser->getEmail(),
                        'first_name' => $givenName ?? $googleUser->user['given_name'] ?? $googleUser->getName(),
                        'last_name' => $familyName ?? $googleUser->user['family_name'] ?? '',
                        'password' => null,
                        'google_id' => $googleUser->getId(),
                        'compleated' => false,
                        'birthdate' => $birthdate,
                        'gender' => $gender,
                    ]);
                }

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
}
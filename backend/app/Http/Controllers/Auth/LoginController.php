<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class LoginController extends Controller
{   
    public function Login(Request $request){    

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
    
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = JWTAuth::fromUser($user, ['id' , 'email']);
            \Log::info('Authenticated user: ' . json_encode($user));
            \Log::info('Generated JWT Token: ' . $token);
            $cookie = cookie(
                'jwt_token',
                $token,
                60, 
                '/', 
                null,
                true, // secure 
                true, // HttpOnly
                false, // SameSite 
                'None',
            );
            
            return response()->json([
                'message' => 'Login complete',
                'user' => $user,
                'redirect_url' => '/home'
            ], 201)->cookie($cookie);
            
        }
    
        return response()->json([
            'message' => 'Invalid credentials',
        ], 422);
    }
}

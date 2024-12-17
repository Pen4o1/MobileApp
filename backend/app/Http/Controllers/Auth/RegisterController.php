<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;



class RegisterController extends Controller
{
    public function Register(Request $request)
    {
        $first_name_validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z]+$/']
        ]);
        
        $last_name_validator = Validator::make($request->all(), [
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z]+$/']
        ]);

        $password_validator = Validator::make($request->all(), [
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/', 
                'regex:/[A-Z]/', 
                'regex:/[0-9]/', 
                'regex:/[@$!%*#?&]/', 
        ]]);

        $email_format_validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255']
        ]);
        
        $email_unique_validator = Validator::make($request->all(), [
            'email' => 'unique:users'
        ]);

        $birthday_validator = Validator::make($request->all(), [
            'birthdate' => 'required|date'
        ]);
        
        $kilos_validator = Validator::make($request->all(), [
            'kilos' => 'required|numeric'
        ]);
        
        $height_validator = Validator::make($request->all(), [
            'height' => 'required|numeric'
        ]);

        if ($first_name_validator->fails()) {
            return response()->json([
                'message' => 'Invalid first name',
                'errors' => $first_name_validator->errors()
            ], 422); 
        }

        if ($last_name_validator->fails()) {
            return response()->json([
                'message' => 'Invalid last name',
                'errors' => $last_name_validator->errors()
            ], 422); 
        }

        if ($password_validator->fails()) {
            return response()->json([
                'message' => 'Invalid password',
                'errors' => $password_validator->errors()
            ], 422);
        }
        
        if ($email_format_validator->fails()) {
            return response()->json([
                'message' => 'Invalid email format',
                'errors' => $email_format_validator->errors()
            ], 422);
        }

        if ($email_unique_validator->fails()) {
            return response()->json([
                'message' => 'Email already exists',
                'errors' => $email_unique_validator->errors()
            ], 422);
        }

        if ($birthday_validator->fails()) {
            return response()->json([
                'message' => 'The birthday must be a valid date',
                'errors' => $birthday_validator->errors()
            ], 422);
        }
        
        if ($kilos_validator->fails()) {
            return response()->json([
                'message' => 'The kilograms must be a valid number',
                'errors' => $kilos_validator->errors()
            ], 422);
        }
        
        if ($height_validator->fails()) {
            return response()->json([
                'message' => 'The height must be a valid number',
                'errors' => $height_validator->errors()
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'birthdate' => $request->birthdate,
            'kilos' => $request->kilos,
            'height' => $request->height,
            'gender' => $request->gender
        ]);

        $token = auth()->claims(['password' => $user->password, 'email' => $user->email,]) ->attempt($request->only('email', 'password'));

        $cookie = cookie(
            'jwt_token',
            $token,
            60, 
            '/', 
            null,
            true, // secure 
            true, // HttpOnly
            false, // SameSite 
            'None'
        );

        return response()->json([
            'message' => 'Registration complete',
            'user' => $user,
            'redirect_url' => '/home'
        ], 201)->cookie($cookie);
        
    }
}

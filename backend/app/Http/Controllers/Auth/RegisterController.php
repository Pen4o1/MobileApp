<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z]+$/'],
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
                'confirmed',
        ]]);

        $email_format_validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255']
        ]);
        
        $email_unique_validator = Validator::make($request->all(), [
            'email' => 'unique:users'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid name',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($password_validator->fails()) {
            return response()->json([
                'message' => 'Invalid passwords',
                'errors' => $validator->errors()
            ], 422);
        }
        
        if ($email_format_validator->fails()) {
            return response()->json([
                'message' => 'Invalid email format',
                'errors' => $validator->errors()
            ], 422);
        }

        if($email_unique_validator->fails()){
            return response()->json([
                'message' => 'Email already exists',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name, 
            'last_name' => $request->last_name, 
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserDetails;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $first_name_validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z]+$/']
        ]);
        
        $last_name_validator = Validator::make($request->all(),[
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

        $birthday_validator = Validator::make($request->all(), [
            'birthdate' => 'required|date'
        ]);
        
        $kilos_validator = Validator::make($request->all(), [
            'kilos' => 'required|numeric'
        ]);

        $height_validator = Validator::make($request->all(), [
            'height' => 'required|numeric'
        ]);

        if($first_name_validator->fails()){
            return response()->json([
                'message' => 'Invalid first name',
                'errors' => $validator->errors()
            ], 422); 
        }

        if($last_name_validator->fails()){
            return response()->json([
                'message' => 'Invalid last name',
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

        if($birthday_validator->fails()){
            return response()->json([
                'message' => 'The Birthday must be a valid date',
                'errors' => $validator->errors()
            ], 422);
        }

        if($kilos_validator->fails()){
            return response()->json([
                'message' => 'The kilograms must be a valid number',
                'errors' => $validator->errors()
            ], 422);
        }

        if($height_validator->fails()){
            return response()->json([
                'message' => 'The height must be a valid number',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name, 
            'last_name' => $request->last_name, 
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $userDetail = UserDetail::create([
            'user_id' => $user->id,
            'birthdate' => $request->birthdate,
            'kilos' => $request->kilos,
            'height' => $request->height,
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'user_detail' => $userDetail,
        ], 201);
    }
}

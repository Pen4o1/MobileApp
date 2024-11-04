<?php

namespace App\Http\Controllers;

use App\Models\UserDetail;
use Illuminate\Http\Request;

class UserInfoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'birthdate' => 'required|date',
            'kilos' => 'required|numeric',
            'height' => 'required|numeric',
        ]);

        $userDetail = UserDetail::create([
            'birthdate' => $request->input('birthdate'),
            'kilos' => $request->input('kilos'),
            'height' => $request->input('height'),
        ]);

        return response()->json(['message' => 'User details saved successfully', 'data' => $userDetail], 201);
    }
}

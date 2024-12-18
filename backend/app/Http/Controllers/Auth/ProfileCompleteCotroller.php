<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProfileCompleteCotroller extends Controller
{
    public function getProfileStatus(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    $requiredFields = ['birthdate', 'kilos', 'height', 'last_name', 'first_name', 'gender'];
    $completedFields = [];
    $incompleteFields = [];
    $profileData = [];

    foreach ($requiredFields as $field) {
        if (!empty($user->$field)) {
            $completedFields[] = $field;
            $profileData[$field] = $user->$field;
        } else {
            $incompleteFields[] = $field;
            $profileData[$field] = ''; 
        }
    }

    return response()->json([
        'completed_fields' => $completedFields,
        'incomplete_fields' => $incompleteFields,
        'profile_data' => $profileData, 
    ]);
}

    public function completeProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $validatedData = $request->validate([
            'birthdate' => 'nullable|date',
            'kilos' => 'nullable|numeric|min:1',
            'height' => 'nullable|numeric|min:1',
            'last_name' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
        ]);
        $validatedData['compleated'] = true;

        $user->update($validatedData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
            'redirect_url' => '/home',
        ]);
    }
}

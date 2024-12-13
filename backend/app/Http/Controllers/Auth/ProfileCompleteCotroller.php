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

        $requiredFields = ['birthdate', 'kilos', 'height', 'last_name', 'first_name'];
        $completedFields = [];
        $incompleteFields = [];

        foreach ($requiredFields as $field) {
            if (!empty($user->$field)) {
                $completedFields[] = $field;
            } else {
                $incompleteFields[] = $field;
            }
        }

        return response()->json([
            'completed_fields' => $completedFields,
            'incomplete_fields' => $incompleteFields,
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
        ]);

        // Update the user's profile with the provided data
        $user->update($validatedData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}

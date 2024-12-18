<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;


class JwtCookieMiddleware
{
    public function handle($request, Closure $next)
    {
        if ($request->hasCookie('jwt_token')) {
            $token = $request->cookie('jwt_token');
            try {
                JWTAuth::setToken($token);
                $user = JWTAuth::authenticate();
                auth()->setUser($user);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Unauthorized: Invalid Token'], 401);
            }
        } else {
            return response()->json(['error' => 'Unauthorized: Token Missing'], 401);
        }

        return $next($request);
    }
}
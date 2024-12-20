<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtCookieMiddleware;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // Define any custom policies here
    ];

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Register any application services
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Sanctum::usePersonalAccessTokenModel(\App\Models\PersonalAccessToken::class);
        //$this->app['router']->pushMiddlewareToGroup('web', JwtCookieMiddleware::class);
        $this->app['router']->pushMiddlewareToGroup('api', JwtCookieMiddleware::class);
    }
}

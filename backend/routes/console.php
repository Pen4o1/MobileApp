<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('app:reset-daily-cal') // php artisan schedule:run or php artisan schedule:list to see the sceduled tasks
    ->daily();

/*
    app(Kernel::class)->command('app:reset-daily-cal')
    ->daily()
    ->describe('Resets all users daily calories.');
*/

<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Console\Kernel;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('app:reset-daily-cal')
    ->hourly();

/*
    app(Kernel::class)->command('app:reset-daily-cal')
    ->daily()
    ->describe('Resets all users daily calories.');
*/

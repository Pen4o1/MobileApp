<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use App\Models\DailyCal;

return function (Schedule $schedule) {
    $schedule->call(function () {
        DailyCal::query()->update(['calories_consumed' => 0]);
    })->dailyAt('00:00'); 
};
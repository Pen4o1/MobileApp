<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DailyCal;
use Carbon\Carbon;


class ResetDailyCal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-daily-cal';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'To reset all users daily calories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DailyCal::whereDate('date', '<', Carbon::today())->delete();
        $this->info('All users daily calories have been reset');
    }
}

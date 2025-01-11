<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('daily_cal', function (Blueprint $table) {
            $table->float('fat_consumed', 8, 2)->after('calories_consumed')->default(0);
            $table->float('protein_consumed', 8, 2)->after('fat_consumed')->default(0);
            $table->float('carbohydrate_consumed', 8, 2)->after('protein_consumed')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_cal', function (Blueprint $table) {
            $table->dropColumn(['fat_consumed', 'protein_consumed', 'carbohydrate_consumed']);
        });
    }
};

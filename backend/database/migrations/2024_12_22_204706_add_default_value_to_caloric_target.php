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
        Schema::table('user_goals', function (Blueprint $table) {
            $table->string('activity_level')->after('user_id'); // Adjust placement as needed
            $table->integer('caloric_target')->default(NULL)->change();    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_goals', function (Blueprint $table) {
            $table->dropColumn('activity_level');
            $table->dropColumn('caloric_target')->change();
        });
    }
};

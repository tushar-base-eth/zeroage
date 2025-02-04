'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { VolumeCharts } from '@/components/dashboard/volume-charts';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col pb-[72px]">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <StatsCards />
            <VolumeCharts />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

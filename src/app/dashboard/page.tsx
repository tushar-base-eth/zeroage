'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { VolumeCharts } from '@/components/dashboard/volume-charts';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col pb-[72px]">
      <div className="container space-y-8 py-8 flex-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <StatsCards />
        
        <div className="grid gap-4 md:grid-cols-4">
          <VolumeCharts />
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}

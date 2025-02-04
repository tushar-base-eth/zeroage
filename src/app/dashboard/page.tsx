import { Metadata } from 'next';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { VolumeCharts } from '@/components/dashboard/volume-charts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | ZeroAge',
  description: 'View your workout statistics and progress',
};

export default function DashboardPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <StatsCards />
      <VolumeCharts />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="container flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/workout">Workout</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/log">Log</Link>
          </Button>
          <Button variant="ghost" className="bg-primary/10" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

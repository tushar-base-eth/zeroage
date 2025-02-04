import { Calendar } from '@/components/ui/calendar';
import { WorkoutHistory } from '@/components/workout-history/workout-history';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LogPage() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Workout Log</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Calendar Section */}
        <div className="rounded-lg border">
          <Calendar className="rounded-md" />
        </div>

        {/* Workout History Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Workout History</h2>
          <WorkoutHistory />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="container flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/workout">Workout</Link>
          </Button>
          <Button variant="ghost" className="bg-primary/10" asChild>
            <Link href="/log">Log</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

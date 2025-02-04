import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WorkoutLogger } from '@/components/workout-logger/workout-logger';
import { ExerciseSelector } from '@/components/workout-logger/exercise-selector';

export default function WorkoutPage() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Workout</h1>
      </div>

      <div className="space-y-6">
        <ExerciseSelector />
        <WorkoutLogger />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="container flex justify-between items-center">
          <Button variant="ghost" className="bg-primary/10" asChild>
            <Link href="/workout">Workout</Link>
          </Button>
          <Button variant="ghost" asChild>
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

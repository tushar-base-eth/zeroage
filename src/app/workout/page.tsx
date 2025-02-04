'use client';

import { WorkoutLogger } from '@/components/workout-logger/workout-logger';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function WorkoutPage() {
  return (
    <div className="min-h-screen flex flex-col pb-[72px]">
      <div className="container space-y-8 py-8 flex-1">
        <h1 className="text-3xl font-bold">Log Workout</h1>
        <WorkoutLogger />
      </div>
      
      <BottomNav />
    </div>
  );
}

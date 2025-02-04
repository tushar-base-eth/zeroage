'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WorkoutLogger } from '@/components/workout-logger/workout-logger';
import { ExerciseSelector } from '@/components/workout-logger/exercise-selector';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useWorkoutStore } from '@/lib/store/workout-store';
import type { Exercise } from '@/types/exercise';

export default function WorkoutPage() {
  const { selectedExercises, setSelectedExercises } = useWorkoutStore();

  const handleExercisesSelected = (exercises: Exercise[]) => {
    setSelectedExercises([...selectedExercises, ...exercises]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="w-full max-w-md mx-auto relative">
          {/* Exercise Selector Button */}
          <div className="fixed top-4 right-4 z-10">
            <ExerciseSelector onSelect={handleExercisesSelected} />
          </div>
          
          {/* Empty State or Workout Logger */}
          <WorkoutLogger exercises={selectedExercises} onExercisesChange={setSelectedExercises} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

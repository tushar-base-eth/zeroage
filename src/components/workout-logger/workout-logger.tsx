'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExerciseSelector } from './exercise-selector';
import { SetLogger } from './set-logger';
import { useToast } from '@/components/ui/use-toast';
import type { Exercise, WorkoutSetInput } from '@/types/api';
import { Plus, Trash2 } from 'lucide-react';

interface ExerciseWithSets {
  exercise: Exercise;
  sets: WorkoutSetInput[];
}

export function WorkoutLogger() {
  const router = useRouter();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    // Check if exercise already exists
    if (exercises.some(e => e.exercise.id === exercise.id)) {
      toast({
        title: 'Exercise already added',
        type: 'warning',
      });
      return;
    }

    setExercises(prev => [
      ...prev,
      {
        exercise,
        sets: [{ set_number: 1, reps: 0, weight: 0 }],
      },
    ]);
  };

  const handleAddSet = (exerciseId: number) => {
    setExercises(prev =>
      prev.map(e => {
        if (e.exercise.id === exerciseId) {
          return {
            ...e,
            sets: [
              ...e.sets,
              {
                set_number: e.sets.length + 1,
                reps: 0,
                weight: 0,
              },
            ],
          };
        }
        return e;
      })
    );
  };

  const handleUpdateSet = (
    exerciseId: number,
    setNumber: number,
    updates: Partial<WorkoutSetInput>
  ) => {
    setExercises(prev =>
      prev.map(e => {
        if (e.exercise.id === exerciseId) {
          return {
            ...e,
            sets: e.sets.map(s =>
              s.set_number === setNumber ? { ...s, ...updates } : s
            ),
          };
        }
        return e;
      })
    );
  };

  const handleRemoveSet = (exerciseId: number, setNumber: number) => {
    setExercises(prev =>
      prev.map(e => {
        if (e.exercise.id === exerciseId) {
          return {
            ...e,
            sets: e.sets
              .filter(s => s.set_number !== setNumber)
              .map((s, i) => ({ ...s, set_number: i + 1 })),
          };
        }
        return e;
      })
    );
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setExercises(prev => prev.filter(e => e.exercise.id !== exerciseId));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercises: exercises.map(e => ({
            exercise_id: e.exercise.id,
            sets: e.sets.map(s => ({
              reps: s.reps,
              weight: s.weight,
            })),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workout');
      }

      toast({
        title: 'Workout logged successfully',
        type: 'success',
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log workout',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <ExerciseSelector onSelect={handleAddExercise} />

      {exercises.map(({ exercise, sets }) => (
        <Card key={exercise.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{exercise.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveExercise(exercise.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {sets.map(set => (
                <SetLogger
                  key={set.set_number}
                  set={set}
                  onUpdate={updates => handleUpdateSet(exercise.id, set.set_number, updates)}
                  onRemove={() => handleRemoveSet(exercise.id, set.set_number)}
                />
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddSet(exercise.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Set
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {exercises.length > 0 && (
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Workout'}
        </Button>
      )}
    </div>
  );
}

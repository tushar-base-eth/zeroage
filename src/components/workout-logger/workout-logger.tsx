'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseSelector } from './exercise-selector';
import { SetLogger } from './set-logger';
import { useToast } from '@/components/ui/use-toast';
import type { Exercise, WorkoutSetInput } from '@/types/api';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface ExerciseWithSets {
  exercise: Exercise;
  sets: WorkoutSetInput[];
}

export function WorkoutLogger() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveWorkoutMutation = useMutation({
    mutationFn: async (data: { sets: { exercise_id: number; reps: number; weight: number; set_number: number }[] }) => {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          sets: data.sets,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Workout saved successfully',
        description: 'Your workout has been logged.',
      });
      router.refresh();
      setExercises([]);
      setSelectedExercises([]);
    },
    onError: (error) => {
      toast({
        title: 'Failed to save workout',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => [...prev, exercise]);
    setExercises(prev => [
      ...prev,
      {
        exercise,
        sets: [{ set_number: 1, reps: 0, weight: 0 }],
      },
    ]);
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(prev => prev.filter(e => e.id !== exerciseId));
    setExercises(prev => prev.filter(e => e.exercise.id !== exerciseId));
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
                reps: e.sets[e.sets.length - 1]?.reps ?? 0,
                weight: e.sets[e.sets.length - 1]?.weight ?? 0,
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
          const newSets = e.sets
            .filter(s => s.set_number !== setNumber)
            .map((s, i) => ({ ...s, set_number: i + 1 }));
          
          // If no sets left, remove the exercise
          if (newSets.length === 0) {
            handleRemoveExercise(exerciseId);
            return e;
          }

          return {
            ...e,
            sets: newSets,
          };
        }
        return e;
      })
    );
  };

  const handleSaveWorkout = async () => {
    // Validate that we have at least one exercise with sets
    if (exercises.length === 0) {
      toast({
        title: 'No exercises added',
        description: 'Please add at least one exercise with sets.',
        variant: 'destructive',
      });
      return;
    }

    // Validate that all exercises have valid sets
    const hasInvalidSets = exercises.some(e =>
      e.sets.some(s => s.reps === 0 || s.weight === 0)
    );

    if (hasInvalidSets) {
      toast({
        title: 'Invalid sets',
        description: 'Please ensure all sets have non-zero reps and weight.',
        variant: 'destructive',
      });
      return;
    }

    // Prepare the workout data
    const sets = exercises.flatMap(e =>
      e.sets.map(s => ({
        exercise_id: e.exercise.id,
        set_number: s.set_number,
        reps: s.reps,
        weight: s.weight,
      }))
    );

    saveWorkoutMutation.mutate({ sets });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ExerciseSelector
            selectedExercises={selectedExercises}
            onSelect={handleAddExercise}
            onRemove={handleRemoveExercise}
          />

          {exercises.map(({ exercise, sets }) => (
            <Card key={exercise.id} className="mt-4">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base font-medium">{exercise.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {sets.map((set) => (
                  <SetLogger
                    key={set.set_number}
                    setNumber={set.set_number}
                    reps={set.reps}
                    weight={set.weight}
                    onUpdate={(updates) =>
                      handleUpdateSet(exercise.id, set.set_number, updates)
                    }
                    onRemove={() => handleRemoveSet(exercise.id, set.set_number)}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddSet(exercise.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          ))}

          {exercises.length > 0 && (
            <Button
              className="w-full"
              onClick={handleSaveWorkout}
              disabled={saveWorkoutMutation.isPending}
            >
              {saveWorkoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Workout
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

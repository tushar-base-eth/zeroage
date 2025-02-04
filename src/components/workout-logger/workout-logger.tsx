'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkoutStore } from '@/lib/store/workout-store';
import type { Exercise, ExerciseSet } from '@/types/exercise';

// Generate a UUID v4-like string
const generateId = () => {
  const hex = '0123456789abcdef';
  let str = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      str += '-';
      continue;
    }
    if (i === 14) {
      str += '4'; // Version 4 UUID
      continue;
    }
    if (i === 19) {
      str += hex[(Math.random() * 4) | 8]; // Variant
      continue;
    }
    str += hex[Math.floor(Math.random() * 16)];
  }
  return str;
};

interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

interface WorkoutLoggerProps {
  exercises: Exercise[];
  onExercisesChange: (exercises: Exercise[]) => void;
}

export function WorkoutLogger({ exercises, onExercisesChange }: WorkoutLoggerProps) {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const { setCurrentWorkout } = useWorkoutStore();

  // Update workoutExercises when exercises prop changes
  useEffect(() => {
    const newExercises = exercises.filter(
      exercise => !workoutExercises.some(we => we.exercise.id === exercise.id)
    ).map(exercise => ({
      exercise,
      sets: [{
        id: generateId(),
        exerciseId: exercise.id,
        reps: 0,
        weight: 0,
        unit: 'kg',
        created_at: new Date().toISOString(),
      }]
    }));
    
    setWorkoutExercises(prev => [...prev, ...newExercises]);
  }, [exercises]);

  const handleAddSet = (exerciseIndex: number) => {
    const newWorkoutExercises = [...workoutExercises];
    const exercise = newWorkoutExercises[exerciseIndex].exercise;
    const newSet: ExerciseSet = {
      id: generateId(),
      exerciseId: exercise.id,
      reps: 0,
      weight: 0,
      unit: 'kg',
      created_at: new Date().toISOString(),
    };
    newWorkoutExercises[exerciseIndex].sets.push(newSet);
    setWorkoutExercises(newWorkoutExercises);
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const newWorkoutExercises = [...workoutExercises];
    const set = newWorkoutExercises[exerciseIndex].sets[setIndex];
    set[field] = parseInt(value) || 0;
    setWorkoutExercises(newWorkoutExercises);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const newWorkoutExercises = [...workoutExercises];
    newWorkoutExercises[exerciseIndex].sets.splice(setIndex, 1);
    if (newWorkoutExercises[exerciseIndex].sets.length === 0) {
      newWorkoutExercises.splice(exerciseIndex, 1);
      // Update parent's exercise list
      onExercisesChange(exercises.filter(e => e.id !== workoutExercises[exerciseIndex].exercise.id));
    }
    setWorkoutExercises(newWorkoutExercises);
  };

  const handleSaveWorkout = async () => {
    try {
      // Validate that all sets have positive reps and weights
      const hasInvalidSets = workoutExercises.some(exercise => 
        exercise.sets.some(set => set.reps <= 0 || set.weight <= 0)
      );

      if (hasInvalidSets) {
        throw new Error('All sets must have positive reps and weights');
      }

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          exercises: workoutExercises.map(e => ({
            exerciseId: e.exercise.id,
            sets: e.sets.map(set => ({
              reps: set.reps,
              weight: set.weight,
              unit: set.unit
            }))
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save workout');
      }
      
      const workout = await response.json();
      setCurrentWorkout(workout);
      setWorkoutExercises([]);
      onExercisesChange([]);
    } catch (error) {
      console.error('Failed to save workout:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-4 relative h-full">
      {workoutExercises.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No exercises added yet. Click the + button to add exercises.
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="space-y-3 pr-4 pb-16">
            {workoutExercises.map((workoutExercise, exerciseIndex) => (
              <Card key={workoutExercise.exercise.id} className="bg-white shadow-sm">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{workoutExercise.exercise.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleAddSet(exerciseIndex)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {workoutExercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="flex items-center gap-2">
                          <div className="w-6 text-xs text-muted-foreground font-medium">
                            #{setIndex + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={set.weight || ''}
                                onChange={(e) =>
                                  handleUpdateSet(exerciseIndex, setIndex, 'weight', e.target.value)
                                }
                                className="w-16 h-8 text-sm"
                              />
                              <span className="text-xs text-muted-foreground">kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={set.reps || ''}
                                onChange={(e) =>
                                  handleUpdateSet(exerciseIndex, setIndex, 'reps', e.target.value)
                                }
                                className="w-16 h-8 text-sm"
                              />
                              <span className="text-xs text-muted-foreground">reps</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      {workoutExercises.length > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button 
            size="sm"
            className="bg-[#14171F] text-white hover:bg-[#14171F]/90 shadow-lg" 
            onClick={handleSaveWorkout}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Workout
          </Button>
        </div>
      )}
    </div>
  );
}

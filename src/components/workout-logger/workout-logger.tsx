'use client';

import { useState } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ExerciseSelector } from './exercise-selector';
import { useWorkoutStore } from '@/lib/store/workout-store';
import type { Exercise, ExerciseSet } from '@/types/exercise';
import crypto from 'crypto';

interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export function WorkoutLogger() {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [notes, setNotes] = useState('');
  const { setCurrentWorkout } = useWorkoutStore();

  const handleAddExercise = (exercise: Exercise) => {
    const newSet: ExerciseSet = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      workoutId: crypto.randomUUID(), // This will be replaced when saving
      reps: 0,
      weight: 0,
      unit: 'kg',
      created_at: new Date().toISOString(),
    };
    setExercises([...exercises, { exercise, sets: [newSet] }]);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const exercise = newExercises[exerciseIndex].exercise;
    const newSet: ExerciseSet = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      workoutId: crypto.randomUUID(), // This will be replaced when saving
      reps: 0,
      weight: 0,
      unit: 'kg',
      created_at: new Date().toISOString(),
    };
    newExercises[exerciseIndex].sets.push(newSet);
    setExercises(newExercises);
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const newExercises = [...exercises];
    const set = newExercises[exerciseIndex].sets[setIndex];
    set[field] = parseInt(value) || 0;
    setExercises(newExercises);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const handleSaveWorkout = async () => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: exercises.map(e => ({
            exerciseId: e.exercise.id,
            sets: e.sets
          })),
          notes
        })
      });

      if (!response.ok) throw new Error('Failed to save workout');
      
      const workout = await response.json();
      setCurrentWorkout(workout);
      // Reset form
      setExercises([]);
      setNotes('');
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <ExerciseSelector onSelect={handleAddExercise} />
          </div>
          
          {exercises.map((exercise, exerciseIndex) => (
            <Card key={exerciseIndex}>
              <CardHeader>
                <CardTitle>{exercise.exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={set.weight || ''}
                        onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={set.reps || ''}
                        onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSet(exerciseIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Set
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Textarea
            placeholder="Workout notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveWorkout} disabled={exercises.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Workout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

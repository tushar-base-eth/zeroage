'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import type { Workout } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ChevronRight, Dumbbell } from 'lucide-react';

export function WorkoutHistory() {
  const { toast } = useToast();
  const { data: workouts, isLoading, error } = useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await fetch('/api/workouts');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return response.json();
    },
  });

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load workout history',
      type: 'error',
    });
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!workouts?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No workouts found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

interface WorkoutCardProps {
  workout: Workout;
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  const { toast } = useToast();

  const totalVolume = workout.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0),
    0
  );

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workout');

      toast({
        title: 'Workout Deleted',
        description: 'Your workout has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{format(parseISO(workout.date), 'MMMM d, yyyy')}</CardTitle>
            <CardDescription>
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''} |{' '}
              {totalVolume.toLocaleString()} kg total volume
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <div key={exercise.exercise.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{exercise.exercise.name}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {exercise.sets.map((set, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border px-2 py-1"
                  >
                    <span className="text-muted-foreground">Set {index + 1}</span>
                    <span>
                      {set.weight}kg × {set.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete Workout
        </Button>
      </CardFooter>
    </Card>
  );
}

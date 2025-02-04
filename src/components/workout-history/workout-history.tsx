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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import type { Workout } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronRight, Dumbbell } from 'lucide-react';

interface WorkoutHistoryProps {
  workouts?: Workout[];
  isLoading?: boolean;
  error?: Error | null;
  showDate?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
}

export function WorkoutHistory({ 
  workouts,
  isLoading,
  error,
  showDate = true,
  maxHeight = '400px',
  emptyMessage = 'No workouts recorded'
}: WorkoutHistoryProps) {
  const { toast } = useToast();

  // Show error toast if error is provided
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load workout history',
      variant: 'destructive',
    });
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!workouts?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ScrollArea className={`h-[${maxHeight}] pr-4`}>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard 
            key={workout.id} 
            workout={workout}
            showDate={showDate}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface WorkoutCardProps {
  workout: Workout;
  showDate?: boolean;
}

function WorkoutCard({ workout, showDate = true }: WorkoutCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">
              {showDate ? (
                format(new Date(workout.created_at), 'MMM d, yyyy h:mm a')
              ) : (
                format(new Date(workout.created_at), 'h:mm a')
              )}
            </div>
            <div className="mt-2 space-y-2">
              {workout.exercises.map((exercise) => (
                <div key={exercise.exercise.id} className="text-sm">
                  <div className="font-medium">{exercise.exercise.name}</div>
                  <div className="text-muted-foreground">
                    {exercise.sets.map((set, i) => (
                      <span key={i}>
                        {i > 0 && ' • '}
                        {set.reps} reps @ {set.weight}kg
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

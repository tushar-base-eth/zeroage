'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkoutStore } from '@/lib/store/workout-store';
import { useUIStore } from '@/lib/store/ui-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function WorkoutHistory() {
  const { workoutHistory, setWorkoutHistory } = useWorkoutStore();
  const { selectedDate, setSelectedDate } = useUIStore();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const data = await response.json();
        setWorkoutHistory(data || []); // Ensure we always set an array
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setWorkoutHistory([]); // Set empty array on error
      }
    };

    fetchWorkouts();
  }, [setWorkoutHistory]);

  const selectedWorkouts = workoutHistory?.filter(
    workout => workout?.created_at && 
      format(new Date(workout.created_at), 'yyyy-MM-dd') === 
      format(selectedDate || new Date(), 'yyyy-MM-dd')
  ) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => setSelectedDate(date)}
            className="rounded-md border"
            required={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            {workoutHistory?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-muted-foreground mb-4">
                  No workouts found. Start tracking your fitness journey today!
                </p>
                <Button asChild>
                  <Link href="/workout">Start Workout</Link>
                </Button>
              </div>
            ) : selectedWorkouts.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No workouts found for this date
              </div>
            ) : (
              <div className="space-y-4">
                {selectedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(workout.created_at), 'h:mm a')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {workout.exercises?.length || 0} exercises
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/workout/${workout.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

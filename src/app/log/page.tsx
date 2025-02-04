'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useWorkoutStore } from '@/lib/store/workout-store';
import type { Workout } from '@/types/workout';

export default function LogPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const { workoutHistory, setWorkoutHistory } = useWorkoutStore();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const data = await response.json();
        setWorkoutHistory(data);
        
        // Extract unique dates
        const dates = [...new Set(data.map((w: Workout) => w.date))];
        setWorkoutDates(dates);
        
        // Set initial selected workouts
        const today = format(new Date(), 'yyyy-MM-dd');
        setSelectedWorkouts(data.filter((w: Workout) => w.date === today));
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };

    fetchWorkouts();
  }, [setWorkoutHistory]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    const selectedDate = format(date, 'yyyy-MM-dd');
    setSelectedWorkouts(workoutHistory.filter(w => w.date === selectedDate));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Calendar */}
          <Card>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                modifiers={{ workout: date => workoutDates.includes(format(date, 'yyyy-MM-dd')) }}
                modifiersStyles={{
                  workout: {
                    backgroundColor: '#22c55e',
                    color: 'white',
                    borderRadius: '100%'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Workout History */}
          <div className="space-y-3">
            {selectedWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-white">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{format(new Date(workout.date), 'MMM d, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">
                        {workout.exercises.length} exercises
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Total Sets</div>
                      <div>{workout.exercises.reduce((acc, e) => acc + e.sets.length, 0)}</div>
                      <div className="text-muted-foreground">Total Volume</div>
                      <div>
                        {workout.exercises.reduce((acc, e) => 
                          acc + e.sets.reduce((setAcc, s) => setAcc + (s.reps * s.weight), 0), 0
                        )} kg
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

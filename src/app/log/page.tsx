'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useQuery } from '@tanstack/react-query';
import type { Workout } from '@/types/api';
import { WorkoutHistory } from '@/components/workout-history/workout-history';

export default function LogPage() {
  const [date, setDate] = useState<Date>(new Date());

  const { data: workouts, isLoading, error } = useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await fetch('/api/workouts');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return response.json();
    },
  });

  const selectedWorkouts = workouts?.filter(w => 
    format(new Date(w.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  ) || [];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-4 flex-1">
        <h1 className="text-2xl font-bold mb-4">Workout Log</h1>

        <div className="grid gap-4 md:grid-cols-[320px_1fr] flex-1">
          <Card className="md:sticky md:top-4 h-fit">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="w-full"
                disabled={(date) => date > new Date()}
                initialFocus
                fromDate={new Date(2024, 0, 1)} // Start from Jan 2024
              />
            </CardContent>
          </Card>

          <div className="flex flex-col flex-1">
            <Card className="flex-1 flex flex-col">
              <CardContent className="p-4 flex-1">
                <h2 className="text-lg font-semibold mb-4">
                  {format(date, 'MMMM d, yyyy')}
                </h2>
                
                <div className="h-[calc(100vh-13rem)]">
                  <WorkoutHistory 
                    workouts={selectedWorkouts}
                    isLoading={isLoading}
                    error={error}
                    showDate={false}
                    maxHeight="100%"
                    emptyMessage="No workouts recorded for this day"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

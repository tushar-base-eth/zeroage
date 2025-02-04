'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useQuery } from '@tanstack/react-query';
import type { Workout } from '@/types/api';

export default function LogPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await fetch('/api/workouts');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return response.json();
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    const selectedDate = format(date, 'yyyy-MM-dd');
    const filteredWorkouts = workouts?.filter(w => 
      format(new Date(w.created_at), 'yyyy-MM-dd') === selectedDate
    ) || [];
    setSelectedWorkouts(filteredWorkouts);
  };

  return (
    <div className="min-h-screen flex flex-col pb-[72px]">
      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Workout Log</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {selectedWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="font-medium">
                      {format(new Date(workout.created_at), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {workout.workout_sets?.length || 0} sets
                    </p>
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

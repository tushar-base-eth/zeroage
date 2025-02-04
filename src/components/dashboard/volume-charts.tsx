'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkoutStore } from '@/lib/store/workout-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { endOfWeek, eachDayOfInterval, format, subWeeks } from 'date-fns';

type TimeRange = '1w' | '2w' | '4w' | '3m';

interface VolumeData {
  date: string;
  volume: number;
}

export function VolumeCharts() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  const { workoutHistory } = useWorkoutStore();

  // Calculate date range
  const endDate = endOfWeek(new Date());
  const startDate = (() => {
    switch (timeRange) {
      case '1w': return subWeeks(endDate, 1);
      case '2w': return subWeeks(endDate, 2);
      case '4w': return subWeeks(endDate, 4);
      case '3m': return subWeeks(endDate, 12);
      default: return subWeeks(endDate, 1);
    }
  })();

  // Generate daily volume data
  const volumeData: VolumeData[] = eachDayOfInterval({ start: startDate, end: endDate })
    .map(date => {
      const dayWorkouts = workoutHistory.filter(workout => {
        if (!workout.created_at) return false;
        const workoutDate = new Date(workout.created_at);
        return format(workoutDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const volume = dayWorkouts.reduce((total, workout) => {
        return total + (workout.exercises?.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + (exercise.sets?.reduce((setTotal, set) => {
            return setTotal + (set.weight * set.reps);
          }, 0) || 0);
        }, 0) || 0);
      }, 0);

      return {
        date: format(date, 'MMM d'),
        volume
      };
    });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Volume Over Time</CardTitle>
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="2w">2 Weeks</SelectItem>
              <SelectItem value="4w">4 Weeks</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

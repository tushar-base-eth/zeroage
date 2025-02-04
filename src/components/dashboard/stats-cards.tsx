'use client';

import { Activity, Calendar, Dumbbell, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkoutStore } from '@/lib/store/workout-store';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { workoutHistory } = useWorkoutStore();

  // Calculate stats
  const totalWorkouts = workoutHistory.length;
  
  const lastWeekWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.created_at || '');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  const totalVolume = workoutHistory.reduce<number>((total, workout) => {
    return total + (workout.exercises?.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + (exercise.sets?.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0) || 0);
    }, 0) || 0);
  }, 0);

  const averageVolume = totalWorkouts > 0 
    ? Math.round(totalVolume / totalWorkouts) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Workouts"
        value={totalWorkouts}
        description="All time"
        icon={<Dumbbell className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Last 7 Days"
        value={lastWeekWorkouts}
        description="Active days"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Volume"
        value={`${totalVolume.toLocaleString()} kg`}
        description="All workouts"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Average Volume"
        value={`${averageVolume.toLocaleString()} kg`}
        description="Per workout"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Workout } from '@/types/api';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (type === 'dates') {
      const { data: dates, error } = await supabase
        .from('workouts')
        .select('created_at')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch workout dates' },
          { status: 500 }
        );
      }

      return NextResponse.json(dates.map(d => d.created_at));
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select(`
        id,
        date,
        created_at,
        workout_sets (
          set_number,
          reps,
          weight,
          exercise:exercises (
            id,
            name,
            primary_muscle,
            secondary_muscles
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch workouts' },
        { status: 500 }
      );
    }

    // Transform data to match our API spec
    const transformedWorkouts = workouts.map(workout => ({
      id: workout.id,
      date: workout.date,
      created_at: workout.created_at,
      exercises: Object.values(
        workout.workout_sets.reduce((acc: any, set: any) => {
          if (!acc[set.exercise.id]) {
            acc[set.exercise.id] = {
              exercise: set.exercise,
              sets: []
            };
          }
          acc[set.exercise.id].sets.push({
            set_number: set.set_number,
            reps: set.reps,
            weight: set.weight
          });
          return acc;
        }, {})
      )
    }));

    return NextResponse.json(transformedWorkouts as Workout[]);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

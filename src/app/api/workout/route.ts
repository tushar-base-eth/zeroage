import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CreateWorkoutSchema } from '@/lib/validations/schema';
import type { WorkoutSet, CreateWorkoutPayload } from '@/types/api';

interface CreateWorkoutRequest {
  userId: string;
  sets: WorkoutSet[];
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const payload = await request.json() as CreateWorkoutPayload;

    // Validate request body
    const result = CreateWorkoutSchema.safeParse(payload);
    if (!result.success) {
      return new NextResponse(JSON.stringify(result.error), { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert([{ user_id: user.id }])
      .select()
      .single();

    if (workoutError || !workout) {
      return NextResponse.json(
        { error: 'Failed to create workout' },
        { status: 500 }
      );
    }

    // Create workout sets
    const sets: WorkoutSet[] = result.data.exercises.flatMap((exercise, exerciseIndex) =>
      exercise.sets.map((set, setIndex) => ({
        workout_id: workout.id,
        exercise_id: exercise.exercise_id,
        set_number: setIndex + 1,
        reps: set.reps,
        weight: set.weight,
      }))
    );

    const { error: setsError } = await supabase
      .from('workout_sets')
      .insert(sets);

    if (setsError) {
      return NextResponse.json(
        { error: 'Failed to create workout sets' },
        { status: 500 }
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error creating workout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Workout ID is required', { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: workout, error } = await supabase
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    // Transform data to match our API spec
    const transformedWorkout = {
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
    };

    return NextResponse.json(transformedWorkout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

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
      .insert([{ 
        user_id: user.id,
        date: result.data.date,
      }])
      .select()
      .single();

    if (workoutError || !workout) {
      console.error('Workout creation error:', workoutError);
      return NextResponse.json(
        { error: 'Failed to create workout' },
        { status: 500 }
      );
    }

    // Create workout sets
    const sets = result.data.exercises.flatMap((exercise, exerciseIndex) =>
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
      console.error('Sets creation error:', setsError);
      // Cleanup workout if sets creation fails
      await supabase.from('workouts').delete().eq('id', workout.id);
      return NextResponse.json(
        { error: 'Failed to create workout sets' },
        { status: 500 }
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Workout creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const query = supabase
      .from('workouts')
      .select(`
        *,
        workout_sets (
          *,
          exercise:exercises (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (date) {
      query.eq('date', date);
    }

    const { data: workouts, error } = await query;

    if (error) {
      console.error('Workouts fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workouts' },
        { status: 500 }
      );
    }

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Workouts fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

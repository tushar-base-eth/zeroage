import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { WorkoutSchema } from '@/lib/validations/schema';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const query = supabase.from('workouts').select(`
      id,
      created_at,
      notes,
      exercises:workout_exercises (
        exercise:exercises (
          id,
          name
        ),
        sets:exercise_sets (
          id,
          reps,
          weight,
          unit
        )
      )
    `);

    if (date) {
      query.eq('date', date);
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    query.eq('user_id', user.user.id).order('created_at', { ascending: false });

    const { data } = await query;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const json = await request.json();

    const result = WorkoutSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid workout data' },
        { status: 400 }
      );
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: workout } = await supabase
      .from('workouts')
      .insert([{ user_id: user.user.id, ...result.data }])
      .select()
      .single();

    // Create workout exercises and sets
    for (const exercise of result.data.exercises) {
      const { data: workoutExercise, error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert([{
          workout_id: workout.id,
          exercise_id: exercise.exerciseId
        }])
        .select()
        .single();

      if (exerciseError) throw exerciseError;

      const setsToInsert = exercise.sets.map(set => ({
        workout_exercise_id: workoutExercise.id,
        ...set
      }));

      const { error: setsError } = await supabase
        .from('exercise_sets')
        .insert(setsToInsert);

      if (setsError) throw setsError;
    }

    return NextResponse.json(workout);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}

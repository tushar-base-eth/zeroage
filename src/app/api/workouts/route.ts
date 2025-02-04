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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (type === 'dates') {
      const { data: dates, error } = await supabase
        .from('workouts')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workout dates:', error);
        return NextResponse.json(
          { error: 'Failed to fetch workout dates' },
          { status: 500 }
        );
      }

      return NextResponse.json(dates?.map(d => d.created_at) || []);
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
      console.error('Error fetching workouts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workouts' },
        { status: 500 }
      );
    }

    // For new users with no workouts, return empty array
    return NextResponse.json(workouts || []);
  } catch (error) {
    console.error('Error in workouts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();
    const workout: Workout = {
      ...json,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single();

    if (error) {
      console.error('Error creating workout:', error);
      return NextResponse.json(
        { error: 'Failed to create workout' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in workouts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

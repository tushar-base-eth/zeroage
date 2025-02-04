import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ExerciseSchema } from '@/lib/validations/schema';
import type { Exercise } from '@/types/api';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { searchParams } = new URL(request.url);
    const muscle = searchParams.get('muscle');

    const query = supabase.from('exercises').select('*');
    if (muscle) {
      query.eq('primary_muscle', muscle);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Exercises fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch exercises' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Exercises fetch error:', error);
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
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const result = ExerciseSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid exercise data', details: result.error.format() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('exercises')
      .insert(result.data)
      .select()
      .single();

    if (error) {
      console.error('Exercise creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create exercise' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Exercise creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

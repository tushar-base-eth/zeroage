import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ExerciseSchema } from '@/lib/validations/schema';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data } = await supabase.from('exercises').select('*');
    return NextResponse.json(data);
  } catch {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const json = await request.json();
    
    const result = ExerciseSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid exercise data' },
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from('exercises')
      .insert(result.data)
      .select()
      .single();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
}

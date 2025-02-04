import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Get user's volume stats (daily, weekly, monthly)
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let query = supabase
      .from('volume_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: stats, error: statsError } = await query;

    if (statsError) throw statsError;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching volume stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

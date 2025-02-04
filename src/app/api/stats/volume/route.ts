import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { VolumeStats } from '@/types/api';

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

    if (statsError) {
      console.error('Error fetching volume stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch volume stats' },
        { status: 500 }
      );
    }

    // For new users with no stats, return empty array
    return NextResponse.json(stats || []);
  } catch (error) {
    console.error('Error fetching volume stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

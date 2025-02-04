import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const groupBy = searchParams.get('group_by');

    if (!startDate || !endDate || !groupBy || !['week', 'month'].includes(groupBy)) {
      return new NextResponse('Invalid parameters. Required: start_date, end_date, and group_by (week or month)', 
        { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get aggregated stats based on grouping
    const query = supabase
      .from('volume_stats')
      .select('date, daily_volume, weekly_volume, monthly_volume')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    const { data, error } = await query;
    if (error) throw error;

    // Aggregate the data based on grouping
    const aggregated = data.reduce((acc: Record<string, number>, curr) => {
      const key = groupBy === 'week' 
        ? getWeekKey(new Date(curr.date))
        : getMonthKey(new Date(curr.date));
      
      // Use the pre-computed weekly/monthly volume for the first occurrence
      if (!acc[key]) {
        acc[key] = groupBy === 'week' ? curr.weekly_volume : curr.monthly_volume;
      }
      return acc;
    }, {});

    // Transform to array and sort by date
    const result = Object.entries(aggregated).map(([key, volume]) => ({
      period: key,
      volume: volume,
      start_date: groupBy === 'week' 
        ? getWeekStart(key) 
        : getMonthStart(key)
    })).sort((a, b) => a.start_date.localeCompare(b.start_date));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching aggregated volume stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper functions for date handling
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const weekNum = getWeekNumber(date);
  return `${year}-W${weekNum.toString().padStart(2, '0')}`;
}

function getMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

function getWeekStart(weekKey: string): string {
  const [year, week] = weekKey.split('-W');
  const date = new Date(parseInt(year), 0, 1);
  date.setDate(date.getDate() + (parseInt(week) - 1) * 7);
  return date.toISOString().split('T')[0];
}

function getMonthStart(monthKey: string): string {
  return monthKey + '-01';
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNum;
}

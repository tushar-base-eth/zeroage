'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { AggregatedVolumeStats } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TimeRange = '1m' | '3m' | '6m' | '1y';
type GroupBy = 'week' | 'month';

export function VolumeCharts() {
  const [timeRange, setTimeRange] = useState<TimeRange>('3m');
  const [groupBy, setGroupBy] = useState<GroupBy>('week');

  const endDate = new Date();
  const startDate = (() => {
    switch (timeRange) {
      case '1m':
        return subMonths(endDate, 1);
      case '3m':
        return subMonths(endDate, 3);
      case '6m':
        return subMonths(endDate, 6);
      case '1y':
        return subMonths(endDate, 12);
    }
  })();

  const { data: volumeStats, isLoading } = useQuery<AggregatedVolumeStats[]>({
    queryKey: ['volume-stats', timeRange, groupBy],
    queryFn: async () => {
      const response = await fetch(
        `/api/stats/volume/aggregated?start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(
          endDate,
          'yyyy-MM-dd'
        )}&group_by=${groupBy}`
      );
      if (!response.ok) throw new Error('Failed to fetch volume stats');
      return response.json();
    },
  });

  if (isLoading) {
    return <VolumeChartsSkeleton />;
  }

  const chartData = volumeStats?.map((stat) => ({
    name: stat.period,
    volume: stat.volume,
    tooltipDate: format(new Date(stat.start_date), groupBy === 'week' ? 'MMM d, yyyy' : 'MMMM yyyy'),
  }));

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Volume Progression</CardTitle>
        <div className="flex space-x-2">
          <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].payload.tooltipDate}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#volume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function VolumeChartsSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <Skeleton className="h-4 w-[150px]" />
        </CardTitle>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

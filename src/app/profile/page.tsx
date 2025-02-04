'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { useQuery } from '@tanstack/react-query';
import type { Profile } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <div className="max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ProfileForm initialData={profile} />
        )}
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-50">
      <div className="container max-w-md mx-auto grid grid-cols-3 gap-4">
        <Button 
          variant={pathname === '/workout' ? 'default' : 'ghost'} 
          asChild 
          className="w-full"
        >
          <Link href="/workout">Workout</Link>
        </Button>
        <Button 
          variant={pathname === '/log' ? 'default' : 'ghost'} 
          asChild 
          className="w-full"
        >
          <Link href="/log">Log</Link>
        </Button>
        <Button 
          variant={pathname === '/dashboard' ? 'default' : 'ghost'} 
          asChild 
          className="w-full"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

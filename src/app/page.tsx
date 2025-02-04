import { Button } from '@/components/ui/button';
import { CalendarIcon, ChartIcon, DumbbellIcon } from '@/components/icons/fitness-icons';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Transform Your Fitness Journey
            </h1>
            <p className="text-xl text-muted-foreground">
              Track workouts, monitor progress, and achieve your fitness goals with ZeroAge
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/signup">Start Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/auth/signin">Login</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <DumbbellIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Workout Tracking</h3>
              <p className="text-muted-foreground">
                Log exercises, sets, and reps with our intuitive workout interface
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ChartIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your fitness journey with detailed progress charts
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CalendarIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workout History</h3>
              <p className="text-muted-foreground">
                Review and analyze your past workouts to optimize your routine
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              2025 ZeroAge. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

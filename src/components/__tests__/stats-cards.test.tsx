import { render, screen } from '@/lib/test-utils';
import { StatsCards } from '../dashboard/stats-cards';
import { useWorkoutStore } from '@/lib/store/workout-store';

jest.mock('@/lib/store/workout-store');

const mockWorkoutHistory = [
  {
    id: '1',
    created_at: '2025-02-04T00:00:00Z',
    exercises: [
      {
        exercise: {
          id: '1',
          name: 'Bench Press'
        },
        sets: [
          { weight: 100, reps: 10 },
          { weight: 100, reps: 10 }
        ]
      }
    ]
  },
  {
    id: '2',
    created_at: '2025-02-03T00:00:00Z',
    exercises: [
      {
        exercise: {
          id: '2',
          name: 'Squat'
        },
        sets: [
          { weight: 150, reps: 8 },
          { weight: 150, reps: 8 }
        ]
      }
    ]
  }
];

describe('StatsCards', () => {
  beforeEach(() => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      isLoading: false,
      setWorkoutHistory: jest.fn(),
      setLoading: jest.fn(),
    });
  });

  it('renders all stat cards', () => {
    render(<StatsCards />);
    
    expect(screen.getByText('Total Workouts')).toBeInTheDocument();
    expect(screen.getByText('Weekly Workouts')).toBeInTheDocument();
    expect(screen.getByText('Total Volume')).toBeInTheDocument();
    expect(screen.getByText('Average Volume')).toBeInTheDocument();
  });

  it('calculates total workouts correctly', () => {
    render(<StatsCards />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calculates total volume correctly', () => {
    render(<StatsCards />);
    // Total volume = (100 * 10 * 2) + (150 * 8 * 2) = 4400
    expect(screen.getByText('4,400 kg')).toBeInTheDocument();
  });

  it('calculates average volume correctly', () => {
    render(<StatsCards />);
    // Average volume = 4400 / 2 = 2200
    expect(screen.getByText('2,200 kg')).toBeInTheDocument();
  });
});

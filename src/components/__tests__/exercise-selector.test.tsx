import { render, screen, waitFor } from '@/lib/test-utils';
import { ExerciseSelector } from '../workout-logger/exercise-selector';
import { useExerciseStore } from '@/lib/store/exercise-store';

// Mock the store
jest.mock('@/lib/store/exercise-store');

const mockExercises = [
  {
    id: '1',
    name: 'Bench Press',
    description: 'Chest exercise',
    muscleGroups: ['chest'],
    equipment: 'barbell',
    isCustom: false,
    created_at: '2025-02-04T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z'
  },
  {
    id: '2',
    name: 'Squat',
    description: 'Leg exercise',
    muscleGroups: ['legs'],
    equipment: 'barbell',
    isCustom: false,
    created_at: '2025-02-04T00:00:00Z',
    updated_at: '2025-02-04T00:00:00Z'
  }
];

describe('ExerciseSelector', () => {
  beforeEach(() => {
    (useExerciseStore as unknown as jest.Mock).mockReturnValue({
      exercises: mockExercises,
      isLoading: false,
      setExercises: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn()
    });
  });

  it('renders exercise selector button', () => {
    const onSelect = jest.fn();
    render(<ExerciseSelector onSelect={onSelect} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select exercise...')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useExerciseStore as unknown as jest.Mock).mockReturnValue({
      exercises: [],
      isLoading: true,
      setExercises: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn()
    });

    const onSelect = jest.fn();
    render(<ExerciseSelector onSelect={onSelect} />);
    
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onSelect when exercise is selected', async () => {
    const onSelect = jest.fn();
    const { user } = render(<ExerciseSelector onSelect={onSelect} />);
    
    await user.click(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Bench Press'));
    expect(onSelect).toHaveBeenCalledWith(mockExercises[0]);
  });
});

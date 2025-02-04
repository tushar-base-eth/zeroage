import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { api, APIError } from '../api-service';

jest.mock('@supabase/auth-helpers-nextjs');

describe('API Service', () => {
  const mockSupabase = {
    from: jest.fn(),
    auth: {
      getUser: jest.fn()
    }
  };

  beforeEach(() => {
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('profile', () => {
    it('fetches profile successfully', async () => {
      const mockProfile = { id: '1', name: 'Test User' };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockProfile, error: null })
      });

      const result = await api.profile.get();
      expect(result).toEqual(mockProfile);
    });

    it('handles profile fetch error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: new Error('Failed') })
      });

      await expect(api.profile.get()).rejects.toThrow(APIError);
    });
  });

  describe('exercises', () => {
    it('lists exercises successfully', async () => {
      const mockExercises = [{ id: '1', name: 'Squat' }];
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockExercises, error: null }),
        order: jest.fn().mockReturnThis()
      });

      const result = await api.exercises.list();
      expect(result).toEqual(mockExercises);
    });

    it('creates exercise successfully', async () => {
      const mockExercise = { id: '1', name: 'Squat' };
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({ data: mockExercise, error: null })
      });

      const result = await api.exercises.create({ name: 'Squat' });
      expect(result).toEqual(mockExercise);
    });
  });

  describe('workouts', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: '1' } }, 
        error: null 
      });
    });

    it('lists workouts successfully', async () => {
      const mockWorkouts = [{ id: '1', exercises: [] }];
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockWorkouts, error: null })
      });

      const result = await api.workouts.list();
      expect(result).toEqual(mockWorkouts);
    });

    it('creates workout successfully', async () => {
      const mockWorkout = {
        date: '2025-02-04',
        exercises: [{
          exerciseId: '1',
          sets: [{
            reps: 10,
            weight: 100,
            unit: 'kg',
            created_at: new Date().toISOString()
          }]
        }]
      };
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({ data: mockWorkout, error: null })
      });

      const result = await api.workouts.create({
        exercises: [{
          exerciseId: '1',
          sets: [{
            reps: 10,
            weight: 100,
            unit: 'kg',
            created_at: new Date().toISOString()
          }]
        }]
      });
      expect(result).toEqual(mockWorkout);
    });

    it('handles unauthorized error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      });

      await expect(api.workouts.create({
        exercises: []
      })).rejects.toThrow('Unauthorized');
    });
  });
});

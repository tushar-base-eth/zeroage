import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Exercise, ExerciseSet } from '@/types/exercise';
import type { Profile } from '@/types/profile';

const supabase = createClientComponentClient();

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  // Profile endpoints
  profile: {
    async get(): Promise<Profile> {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) throw new APIError('Failed to fetch profile', 500);
      return profile;
    },

    async update(profile: Partial<Profile>): Promise<Profile> {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw new APIError('Failed to update profile', 500);
      return updatedProfile;
    }
  },

  // Exercise endpoints
  exercises: {
    async list(): Promise<Exercise[]> {
      const { data: exercises, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw new APIError('Failed to fetch exercises', 500);
      return exercises;
    },

    async create(exercise: Partial<Exercise>): Promise<Exercise> {
      const { data: newExercise, error } = await supabase
        .from('exercises')
        .insert([exercise])
        .select()
        .single();

      if (error) throw new APIError('Failed to create exercise', 500);
      return newExercise;
    }
  },

  // Workout endpoints
  workouts: {
    async list(timeRange?: { start: Date; end: Date }) {
      let query = supabase
        .from('workouts')
        .select(`
          id,
          created_at,
          notes,
          exercises:workout_exercises(
            exercise:exercises(
              id,
              name,
              muscle_groups,
              equipment
            ),
            sets:exercise_sets(
              id,
              reps,
              weight,
              unit,
              notes
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (timeRange) {
        query = query
          .gte('created_at', timeRange.start.toISOString())
          .lte('created_at', timeRange.end.toISOString());
      }

      const { data: workouts, error } = await query;

      if (error) throw new APIError('Failed to fetch workouts', 500);
      return workouts;
    },

    async create(workout: {
      notes?: string;
      exercises: Array<{
        exerciseId: string;
        sets: Omit<ExerciseSet, 'id' | 'exerciseId' | 'workoutId'>[];
      }>;
    }) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new APIError('Unauthorized', 401);

      // Start a transaction
      const { data: newWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert([{ user_id: user.id, notes: workout.notes }])
        .select()
        .single();

      if (workoutError) throw new APIError('Failed to create workout', 500);

      // Create workout exercises and sets
      for (const exercise of workout.exercises) {
        const { data: workoutExercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert([{
            workout_id: newWorkout.id,
            exercise_id: exercise.exerciseId
          }])
          .select()
          .single();

        if (exerciseError) throw new APIError('Failed to create workout exercise', 500);

        const setsToInsert = exercise.sets.map(set => ({
          workout_exercise_id: workoutExercise.id,
          ...set
        }));

        const { error: setsError } = await supabase
          .from('exercise_sets')
          .insert(setsToInsert);

        if (setsError) throw new APIError('Failed to create exercise sets', 500);
      }

      return newWorkout;
    }
  }
};

export interface Profile {
  user_id: string;
  name: string;
  weight?: number;
  height?: number;
  body_fat?: number;
  date_of_birth?: string;
  gender?: string;
  unit: 'kg' | 'lbs';
}

export interface Exercise {
  id: number;
  name: string;
  primary_muscle: string;
  secondary_muscles: string[];
}

export interface WorkoutSet {
  id?: number;
  workout_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight: number;
  exercise?: Exercise;
}

// For creating a new workout
export interface WorkoutSetInput {
  set_number: number;
  reps: number;
  weight: number;
}

export interface ExerciseWithSets {
  exercise: Exercise;
  sets: WorkoutSetInput[];
}

export interface Workout {
  id: number;
  date: string;
  created_at: string;
  user_id: string;
  workout_sets: WorkoutSet[];
  exercises: ExerciseWithSets[];
}

export interface CreateWorkoutPayload {
  date: string;
  exercises: Array<{
    exercise_id: number;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
}

export interface UserStats {
  total_workouts: number;
  total_volume: number;
  current_streak: number;
  best_streak: number;
}

export interface VolumeStats {
  date: string;
  daily_volume: number;
  weekly_volume: number;
  monthly_volume: number;
}

export interface AggregatedVolumeStats {
  period: string;
  volume: number;
  start_date: string;
}

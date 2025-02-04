export interface Exercise {
  id: number;
  name: string;
  primary_muscle: string;
  secondary_muscles: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutSet {
  id: number;
  workout_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight: number;
  created_at: string;
  updated_at: string;
  exercise: Exercise;
}

export interface Workout {
  id: number;
  user_id: string;
  date: string;
  created_at: string;
  updated_at: string;
  workout_sets: WorkoutSet[];
}

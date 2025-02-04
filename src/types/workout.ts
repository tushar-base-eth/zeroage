export interface Set {
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: Set[];
}

export interface Workout {
  id?: string;
  userId: string;
  exercises: WorkoutExercise[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

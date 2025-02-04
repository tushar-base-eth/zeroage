export interface Set {
  id?: string;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
  created_at?: string;
}

export interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  sets: Set[];
  created_at?: string;
}

export interface Workout {
  id?: string;
  userId?: string;
  date: string;
  exercises: WorkoutExercise[];
  created_at?: string;
}

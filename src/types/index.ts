export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  unit: 'kg' | 'lbs';
  weight: number;
  height: number;
  bodyFat?: number;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroups: Array<'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core' | 'full_body' | 'cardio'>;
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'kettlebell' | 'other';
  isCustom: boolean;
  userId?: string;
  created_at?: string;
  updated_at?: string;
}

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

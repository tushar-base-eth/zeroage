export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'
  | 'full_body'
  | 'cardio';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'bodyweight'
  | 'cable'
  | 'kettlebell'
  | 'other';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment;
  isCustom: boolean;
  userId?: string; // Only present for custom exercises
  created_at: string;
  updated_at: string;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  workoutId: string;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
  created_at: string;
}

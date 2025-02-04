import { z } from 'zod';

// Enum schemas
export const muscleGroupSchema = z.enum([
  'chest',
  'back',
  'shoulders',
  'legs',
  'arms',
  'core',
  'full_body',
  'cardio'
]);

export const equipmentSchema = z.enum([
  'barbell',
  'dumbbell',
  'machine',
  'bodyweight',
  'cable',
  'kettlebell',
  'other'
]);

// Profile schemas
export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  unit: z.enum(['kg', 'lbs']),
  weight: z.number().positive(),
  height: z.number().positive(),
  bodyFat: z.number().min(1).max(100).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['male', 'female', 'other'])
});

export const profileUpdateSchema = profileSchema.partial().omit({ id: true });

// Exercise schemas
export const ExerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  muscleGroups: z.array(muscleGroupSchema).min(1),
  equipment: equipmentSchema,
  isCustom: z.boolean().default(false),
  userId: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// Workout schemas
export const SetSchema = z.object({
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  unit: z.enum(['kg', 'lbs'])
});

export const WorkoutExerciseSchema = z.object({
  exerciseId: z.string(),
  sets: z.array(SetSchema).min(1)
});

export const WorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  exercises: z.array(WorkoutExerciseSchema).min(1)
});

export class ValidationError {
  constructor(
    public path: (string | number)[],
    public message: string
  ) {}
}

export function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map(err => new ValidationError(
    err.path,
    err.message
  ));
}

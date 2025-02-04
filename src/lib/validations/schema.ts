import { z } from 'zod';

// Profile schemas
export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  body_fat: z.number().min(0).max(100).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  unit: z.enum(['kg', 'lbs']),
});

export const profileUpdateSchema = ProfileSchema.partial().omit({ user_id: true });

// Exercise schemas
export const ExerciseSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  primary_muscle: z.string(),
  secondary_muscles: z.array(z.string()),
});

// Workout schemas
export const WorkoutSetSchema = z.object({
  set_number: z.number(),
  reps: z.number().positive(),
  weight: z.number().nonnegative(),
});

export const WorkoutSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid(),
  date: z.string(),
  created_at: z.string(),
  workout_sets: z.array(WorkoutSetSchema),
});

export const CreateWorkoutSchema = z.object({
  date: z.string(),
  exercises: z.array(
    z.object({
      exercise_id: z.number(),
      sets: z.array(
        z.object({
          reps: z.number().positive(),
          weight: z.number().nonnegative(),
        })
      ),
    })
  ),
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

-- First disable RLS
ALTER TABLE IF EXISTS public.workouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workout_exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exercise_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can insert their own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can view their workout exercises" ON public.workout_exercises;
DROP POLICY IF EXISTS "Users can insert their workout exercises" ON public.workout_exercises;
DROP POLICY IF EXISTS "Users can view their exercise sets" ON public.exercise_sets;
DROP POLICY IF EXISTS "Users can insert their exercise sets" ON public.exercise_sets;
DROP POLICY IF EXISTS "Users can view all exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can insert custom exercises" ON public.exercises;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.exercise_sets CASCADE;
DROP TABLE IF EXISTS public.workout_exercises CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exercises table
CREATE TABLE public.exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  muscle_groups TEXT[] NOT NULL,
  equipment VARCHAR(50) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workouts table
CREATE TABLE public.workouts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workout_exercises table
CREATE TABLE public.workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER REFERENCES public.workouts(id) NOT NULL,
  exercise_id INTEGER REFERENCES public.exercises(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exercise_sets table
CREATE TABLE public.exercise_sets (
  id SERIAL PRIMARY KEY,
  workout_exercise_id INTEGER REFERENCES public.workout_exercises(id) NOT NULL,
  reps INTEGER NOT NULL CHECK (reps > 0),
  weight NUMERIC(5,2) NOT NULL CHECK (weight > 0),
  unit VARCHAR(3) NOT NULL CHECK (unit IN ('kg', 'lbs')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Workouts policies
CREATE POLICY "Users can view their own workouts"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Workout exercises policies
CREATE POLICY "Users can view their workout exercises"
  ON public.workout_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their workout exercises"
  ON public.workout_exercises FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

-- Exercise sets policies
CREATE POLICY "Users can view their exercise sets"
  ON public.exercise_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workout_exercises
    JOIN public.workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = exercise_sets.workout_exercise_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their exercise sets"
  ON public.exercise_sets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workout_exercises
    JOIN public.workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = exercise_sets.workout_exercise_id
    AND workouts.user_id = auth.uid()
  ));

-- Exercises policies
CREATE POLICY "Users can view all exercises"
  ON public.exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can insert custom exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert default exercises
INSERT INTO public.exercises (name, muscle_groups, equipment, description) VALUES
  ('Push-ups', ARRAY['chest', 'shoulders', 'arms'], 'bodyweight', 'Classic bodyweight exercise for upper body strength'),
  ('Pull-ups', ARRAY['back', 'arms'], 'bodyweight', 'Upper body pulling exercise'),
  ('Squats', ARRAY['legs'], 'bodyweight', 'Fundamental lower body exercise'),
  ('Deadlift', ARRAY['back', 'legs'], 'barbell', 'Compound exercise for posterior chain'),
  ('Bench Press', ARRAY['chest', 'shoulders', 'arms'], 'barbell', 'Classic chest exercise'),
  ('Overhead Press', ARRAY['shoulders', 'arms'], 'barbell', 'Vertical pressing movement'),
  ('Rows', ARRAY['back'], 'barbell', 'Horizontal pulling movement'),
  ('Lunges', ARRAY['legs'], 'bodyweight', 'Unilateral leg exercise'),
  ('Dips', ARRAY['chest', 'arms'], 'bodyweight', 'Upper body pushing exercise'),
  ('Plank', ARRAY['core'], 'bodyweight', 'Core stability exercise');

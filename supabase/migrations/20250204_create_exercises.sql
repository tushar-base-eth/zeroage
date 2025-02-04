-- Create enum types for muscle groups and equipment
CREATE TYPE muscle_group AS ENUM (
  'chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'full_body', 'cardio'
);

CREATE TYPE equipment_type AS ENUM (
  'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell', 'other'
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_groups muscle_group[] NOT NULL,
  equipment equipment_type NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create RLS policies
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Everyone can read default exercises
CREATE POLICY "Everyone can read default exercises" ON exercises
  FOR SELECT
  USING (is_custom = false);

-- Users can read their own custom exercises
CREATE POLICY "Users can read own custom exercises" ON exercises
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own custom exercises
CREATE POLICY "Users can create own custom exercises" ON exercises
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

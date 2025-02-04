-- Create workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create workout_exercises table (junction table between workouts and exercises)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create exercise_sets table
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  reps INTEGER NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  unit VARCHAR(3) NOT NULL DEFAULT 'kg',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- RLS policies for workouts
CREATE POLICY "Users can create their own workouts" ON workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workouts" ON workouts
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS policies for workout_exercises
CREATE POLICY "Users can create workout exercises for their workouts" ON workout_exercises
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE id = workout_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view workout exercises for their workouts" ON workout_exercises
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE id = workout_id
      AND user_id = auth.uid()
    )
  );

-- RLS policies for exercise_sets
CREATE POLICY "Users can create sets for their workout exercises" ON exercise_sets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sets for their workout exercises" ON exercise_sets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id
      AND w.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at on workouts
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

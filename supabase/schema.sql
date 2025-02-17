-- Clean up existing objects
DO $$ 
BEGIN
    -- Drop existing policies if tables exist
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workouts') THEN
        DROP POLICY IF EXISTS "Users can view their own workouts" ON public.workouts;
        DROP POLICY IF EXISTS "Users can insert their own workouts" ON public.workouts;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sets') THEN
        DROP POLICY IF EXISTS "Users can view their workout sets" ON public.workout_sets;
        DROP POLICY IF EXISTS "Users can insert their workout sets" ON public.workout_sets;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'exercises') THEN
        DROP POLICY IF EXISTS "Users can view all exercises" ON public.exercises;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
        DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    END IF;

    -- Drop existing materialized views
    DROP MATERIALIZED VIEW IF EXISTS workout_history;
    DROP MATERIALIZED VIEW IF EXISTS user_stats;
    DROP MATERIALIZED VIEW IF EXISTS volume_stats;

    -- Drop existing functions and triggers
    DROP FUNCTION IF EXISTS refresh_stats() CASCADE;
    DROP FUNCTION IF EXISTS update_workout_has_sets() CASCADE;
END $$;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.workout_sets CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    weight NUMERIC CHECK (weight > 0),
    height NUMERIC CHECK (height > 0),
    body_fat NUMERIC CHECK (body_fat >= 0),
    date_of_birth DATE,
    gender TEXT,
    unit TEXT CHECK (unit IN ('kg', 'lbs')) NOT NULL DEFAULT 'kg',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE public.exercises (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    primary_muscle TEXT NOT NULL,
    secondary_muscles TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE public.workouts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date DATE NOT NULL,
    has_sets BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_workout UNIQUE (user_id, date, created_at)
);

-- Create workout sets table
CREATE TABLE public.workout_sets (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    workout_id BIGINT REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES exercises(id),
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL CHECK (reps > 0),
    weight NUMERIC(5,2) NOT NULL CHECK (weight >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_set_in_workout UNIQUE (workout_id, exercise_id, set_number)
);

-- Create indexes for fast lookups
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX idx_workout_sets_workout ON workout_sets(workout_id);
CREATE INDEX idx_workouts_with_sets ON workouts(user_id, date) WHERE has_sets = true;

-- Function to update workout has_sets flag
CREATE OR REPLACE FUNCTION update_workout_has_sets()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE workouts SET has_sets = true WHERE id = NEW.workout_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE workouts SET has_sets = EXISTS(
            SELECT 1 FROM workout_sets WHERE workout_id = OLD.workout_id
        )
        WHERE id = OLD.workout_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workout_sets to update has_sets
CREATE TRIGGER update_workout_has_sets_trigger
AFTER INSERT OR DELETE ON workout_sets
FOR EACH ROW
EXECUTE FUNCTION update_workout_has_sets();

-- Create materialized view for workout history with unique index
CREATE MATERIALIZED VIEW workout_history AS
SELECT 
    w.id,
    w.user_id,
    w.date,
    w.created_at,
    COUNT(DISTINCT ws.exercise_id) as exercise_count,
    COUNT(*) as total_sets,
    SUM(ws.reps * ws.weight) as total_volume
FROM workouts w
JOIN workout_sets ws ON w.id = ws.workout_id
GROUP BY w.id, w.user_id, w.date, w.created_at;

CREATE UNIQUE INDEX idx_workout_history_unique ON workout_history(id);
CREATE INDEX idx_workout_history_user_date ON workout_history(user_id, date DESC);

-- Create materialized view for user stats with optimized streak calculation
CREATE MATERIALIZED VIEW user_stats AS
WITH consecutive_days AS (
    SELECT 
        user_id,
        date,
        date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date))::integer AS grp
    FROM (
        SELECT DISTINCT user_id, date 
        FROM workouts 
        WHERE has_sets = true
    ) AS workout_dates
),
streaks AS (
    SELECT 
        user_id,
        COUNT(*) as streak_length,
        MIN(date) as streak_start,
        MAX(date) as streak_end
    FROM consecutive_days
    GROUP BY user_id, grp
)
SELECT 
    w.user_id,
    COUNT(DISTINCT w.id) as total_workouts,
    SUM(ws.reps * ws.weight) as total_volume,
    COALESCE(
        (SELECT streak_length 
         FROM streaks s 
         WHERE s.user_id = w.user_id 
         AND s.streak_end = (SELECT MAX(date) FROM workouts w2 WHERE w2.user_id = w.user_id AND has_sets = true)
        ), 0
    ) as current_streak,
    COALESCE(MAX(s.streak_length), 0) as longest_streak
FROM workouts w
JOIN workout_sets ws ON w.id = ws.workout_id
LEFT JOIN streaks s ON w.user_id = s.user_id
GROUP BY w.user_id;

CREATE UNIQUE INDEX idx_user_stats_unique ON user_stats(user_id);

-- Create materialized view for volume stats with optimized joins
CREATE MATERIALIZED VIEW volume_stats AS
SELECT 
    w.user_id,
    w.date,
    SUM(ws.reps * ws.weight) as daily_volume,
    SUM(SUM(ws.reps * ws.weight)) OVER (
        PARTITION BY w.user_id, DATE_TRUNC('week', w.date)
    ) as weekly_volume,
    SUM(SUM(ws.reps * ws.weight)) OVER (
        PARTITION BY w.user_id, DATE_TRUNC('month', w.date)
    ) as monthly_volume
FROM workouts w
JOIN workout_sets ws ON w.id = ws.workout_id
GROUP BY w.user_id, w.date;

CREATE UNIQUE INDEX idx_volume_stats_unique ON volume_stats(user_id, date);

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_stats()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY workout_history;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY volume_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-refresh
DROP TRIGGER IF EXISTS refresh_stats_trigger ON workout_sets;
CREATE TRIGGER refresh_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON workout_sets
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_stats();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Exercises policies (read-only for users)
CREATE POLICY "Users can view all exercises"
    ON public.exercises FOR SELECT
    USING (true);

-- Workouts policies
CREATE POLICY "Users can view their own workouts"
    ON public.workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
    ON public.workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Workout sets policies
CREATE POLICY "Users can view their workout sets"
    ON public.workout_sets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM workouts w 
        WHERE w.id = workout_sets.workout_id 
        AND w.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their workout sets"
    ON public.workout_sets FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM workouts w 
        WHERE w.id = workout_sets.workout_id 
        AND w.user_id = auth.uid()
    ));

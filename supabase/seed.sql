-- Insert default exercises first
INSERT INTO public.exercises (name, description, muscle_groups, equipment, is_custom)
VALUES
  ('Bench Press', 'Classic chest exercise', ARRAY['chest', 'triceps', 'shoulders'], 'barbell', false),
  ('Squat', 'Fundamental lower body exercise', ARRAY['quadriceps', 'hamstrings', 'glutes'], 'barbell', false),
  ('Deadlift', 'Full body pulling exercise', ARRAY['back', 'hamstrings', 'glutes'], 'barbell', false),
  ('Pull Up', 'Upper body pulling exercise', ARRAY['back', 'biceps'], 'bodyweight', false),
  ('Push Up', 'Bodyweight chest exercise', ARRAY['chest', 'triceps', 'shoulders'], 'bodyweight', false),
  ('Overhead Press', 'Shoulder strength exercise', ARRAY['shoulders', 'triceps'], 'barbell', false),
  ('Barbell Row', 'Back strength exercise', ARRAY['back', 'biceps'], 'barbell', false),
  ('Dumbbell Curl', 'Bicep isolation exercise', ARRAY['biceps'], 'dumbbell', false),
  ('Tricep Extension', 'Tricep isolation exercise', ARRAY['triceps'], 'dumbbell', false),
  ('Leg Press', 'Machine leg exercise', ARRAY['quadriceps', 'hamstrings', 'glutes'], 'machine', false);

-- Create sample users using Supabase auth functions
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user4_id UUID;
  user5_id UUID;
BEGIN
  -- Create temporary table for user IDs
  CREATE TEMP TABLE temp_users (
    id UUID,
    row_num SERIAL
  );

  -- Create users through auth.users() and store IDs
  WITH new_users AS (
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user1@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
      ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user2@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
      ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user3@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
      ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user4@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
      ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'user5@example.com', crypt('password123', gen_salt('bf')), now(), now(), now())
    RETURNING id
  )
  INSERT INTO temp_users (id)
  SELECT id FROM new_users;

  -- Assign UUIDs to variables
  SELECT id INTO user1_id FROM temp_users WHERE row_num = 1;
  SELECT id INTO user2_id FROM temp_users WHERE row_num = 2;
  SELECT id INTO user3_id FROM temp_users WHERE row_num = 3;
  SELECT id INTO user4_id FROM temp_users WHERE row_num = 4;
  SELECT id INTO user5_id FROM temp_users WHERE row_num = 5;

  -- Insert profiles for users
  INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
  VALUES
    (user1_id, 'johndoe', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', now(), now()),
    (user2_id, 'janedoe', 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', now(), now()),
    (user3_id, 'mikebrown', 'Mike Brown', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', now(), now()),
    (user4_id, 'sarahlee', 'Sarah Lee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', now(), now()),
    (user5_id, 'alexsmith', 'Alex Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', now(), now());

  -- Insert sample workouts
  INSERT INTO public.workouts (user_id, date, created_at)
  VALUES 
    -- User 1's workouts
    (user1_id, '2025-02-01', now()),
    (user1_id, '2025-02-03', now()),
    (user1_id, '2025-02-04', now()),
    -- User 2's workouts
    (user2_id, '2025-02-01', now()),
    (user2_id, '2025-02-02', now()),
    (user2_id, '2025-02-04', now());

  -- Insert sample workout exercises
  WITH workout_ids AS (
    SELECT id FROM public.workouts ORDER BY id DESC LIMIT 6
  )
  INSERT INTO public.workout_exercises (workout_id, exercise_id, created_at)
  SELECT 
    w.id,
    e.id,
    now()
  FROM workout_ids w
  CROSS JOIN LATERAL (
    SELECT id FROM public.exercises ORDER BY RANDOM() LIMIT 3
  ) e;

  -- Insert sample exercise sets
  INSERT INTO public.exercise_sets (workout_exercise_id, reps, weight, unit, created_at)
  SELECT 
    we.id,
    floor(random() * 10 + 5)::integer,  -- Random reps between 5-15
    floor(random() * 50 + 20)::integer, -- Random weight between 20-70
    'kg',
    now()
  FROM public.workout_exercises we;

  -- Clean up
  DROP TABLE temp_users;
END $$;

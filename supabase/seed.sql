-- Insert default exercises
INSERT INTO public.exercises (name, primary_muscle, secondary_muscles) VALUES
  ('Bench Press', 'chest', ARRAY['shoulders', 'triceps']),
  ('Squat', 'quadriceps', ARRAY['hamstrings', 'glutes']),
  ('Deadlift', 'back', ARRAY['hamstrings', 'glutes']),
  ('Pull-ups', 'back', ARRAY['biceps', 'shoulders']),
  ('Overhead Press', 'shoulders', ARRAY['triceps', 'chest']),
  ('Barbell Row', 'back', ARRAY['biceps', 'shoulders']),
  ('Romanian Deadlift', 'hamstrings', ARRAY['glutes', 'back']),
  ('Incline Bench Press', 'chest', ARRAY['shoulders', 'triceps']),
  ('Front Squat', 'quadriceps', ARRAY['core', 'glutes']),
  ('Barbell Curl', 'biceps', ARRAY['forearms']),
  ('Tricep Extension', 'triceps', ARRAY[]::text[]),
  ('Lateral Raise', 'shoulders', ARRAY[]::text[]),
  ('Leg Press', 'quadriceps', ARRAY['hamstrings', 'glutes']),
  ('Dumbbell Row', 'back', ARRAY['biceps', 'shoulders']),
  ('Push-ups', 'chest', ARRAY['shoulders', 'triceps']);

-- Create sample users
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
BEGIN
  -- Create temporary table for user IDs
  CREATE TEMP TABLE temp_users (
    id UUID,
    row_num SERIAL
  );

  -- Insert users with properly hashed passwords
  WITH new_users AS (
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES
      (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'john@example.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        ''
      ),
      (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'sarah@example.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        ''
      ),
      (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'mike@example.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        ''
      )
    RETURNING id
  )
  INSERT INTO temp_users (id)
  SELECT id FROM new_users;

  -- Assign UUIDs to variables
  SELECT id INTO user1_id FROM temp_users WHERE row_num = 1;
  SELECT id INTO user2_id FROM temp_users WHERE row_num = 2;
  SELECT id INTO user3_id FROM temp_users WHERE row_num = 3;

  -- Insert profiles for users
  INSERT INTO public.profiles (user_id, name, weight, height, unit, created_at, updated_at)
  VALUES
    (user1_id, 'John Smith', 75.5, 180.0, 'kg', now(), now()),
    (user2_id, 'Sarah Lee', 58.0, 165.0, 'kg', now(), now()),
    (user3_id, 'Mike Brown', 82.0, 175.0, 'kg', now(), now());

  -- Insert workouts for the past week with explicit timestamps
  WITH workout_dates AS (
    SELECT 
      user1_id as user_id,
      day::date as date,
      day as ts
    FROM generate_series(
      now() - interval '7 days',
      now(),
      interval '2 days'
    ) as day
    UNION ALL
    SELECT 
      user2_id as user_id,
      day::date as date,
      day as ts
    FROM generate_series(
      now() - interval '7 days',
      now(),
      interval '3 days'
    ) as day
    UNION ALL
    SELECT 
      user3_id as user_id,
      day::date as date,
      day as ts
    FROM generate_series(
      now() - interval '7 days',
      now(),
      interval '2 days'
    ) as day
  )
  INSERT INTO public.workouts (user_id, date, created_at, updated_at)
  SELECT 
    user_id,
    date,
    ts,
    ts
  FROM workout_dates;

  -- Insert workout sets
  WITH workout_info AS (
    SELECT 
      w.id,
      w.created_at as workout_time,
      ROW_NUMBER() OVER (ORDER BY w.created_at) as row_num
    FROM public.workouts w
    ORDER BY w.created_at
  )
  INSERT INTO public.workout_sets (workout_id, exercise_id, set_number, reps, weight, created_at, updated_at)
  SELECT 
    w.id,
    e.id,
    s.set_number,
    CASE 
      WHEN e.name IN ('Bench Press', 'Squat', 'Deadlift') THEN 
        floor(random() * 3 + 3)::integer  -- 3-5 reps for main lifts
      WHEN e.name IN ('Pull-ups', 'Push-ups') THEN 
        floor(random() * 5 + 8)::integer  -- 8-12 reps for bodyweight
      ELSE 
        floor(random() * 4 + 8)::integer  -- 8-12 reps for accessories
    END as reps,
    CASE 
      WHEN e.name = 'Bench Press' THEN floor(random() * 20 + 60)  -- 60-80kg
      WHEN e.name = 'Squat' THEN floor(random() * 30 + 80)        -- 80-110kg
      WHEN e.name = 'Deadlift' THEN floor(random() * 40 + 100)    -- 100-140kg
      WHEN e.name IN ('Pull-ups', 'Push-ups') THEN 0             -- Bodyweight
      ELSE floor(random() * 15 + 20)                             -- 20-35kg for accessories
    END as weight,
    w.workout_time,
    w.workout_time
  FROM workout_info w
  CROSS JOIN LATERAL (
    -- Push day exercises
    SELECT id, name FROM public.exercises 
    WHERE name IN ('Bench Press', 'Overhead Press', 'Incline Bench Press')
    AND w.row_num % 3 = 1
    UNION ALL
    -- Pull day exercises
    SELECT id, name FROM public.exercises 
    WHERE name IN ('Deadlift', 'Pull-ups', 'Barbell Row')
    AND w.row_num % 3 = 2
    UNION ALL
    -- Leg day exercises
    SELECT id, name FROM public.exercises 
    WHERE name IN ('Squat', 'Romanian Deadlift', 'Leg Press')
    AND w.row_num % 3 = 0
  ) e
  CROSS JOIN (
    SELECT generate_series(1, 3) as set_number
  ) s;

  -- Update has_sets flag for workouts (should be handled by trigger, but just in case)
  UPDATE public.workouts w
  SET has_sets = true
  WHERE EXISTS (
    SELECT 1 FROM public.workout_sets ws
    WHERE ws.workout_id = w.id
  );

  -- Clean up
  DROP TABLE temp_users;
END $$;

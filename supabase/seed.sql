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

-- Create sample users
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
        'user11@example.com',
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
        'user22@example.com',
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
        'user33@example.com',
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
        'user44@example.com',
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
        'user55@example.com',
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
  SELECT id INTO user4_id FROM temp_users WHERE row_num = 4;
  SELECT id INTO user5_id FROM temp_users WHERE row_num = 5;

  -- Insert profiles for users
  INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
  VALUES
    (user1_id, 'johndoe1', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', now(), now()),
    (user2_id, 'janedoe2', 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', now(), now()),
    (user3_id, 'mikebrown3', 'Mike Brown', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', now(), now()),
    (user4_id, 'sarahlee4', 'Sarah Lee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', now(), now()),
    (user5_id, 'alexsmith5', 'Alex Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', now(), now());

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

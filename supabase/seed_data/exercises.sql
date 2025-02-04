-- Seed default exercises
INSERT INTO exercises (name, description, muscle_groups, equipment, is_custom) VALUES
-- Chest exercises
('Bench Press', 'Classic compound movement for chest development', ARRAY['chest', 'shoulders', 'arms']::muscle_group[], 'barbell', false),
('Push-ups', 'Fundamental bodyweight exercise for upper body strength', ARRAY['chest', 'shoulders', 'arms', 'core']::muscle_group[], 'bodyweight', false),
('Dumbbell Flyes', 'Isolation exercise for chest development', ARRAY['chest']::muscle_group[], 'dumbbell', false),

-- Back exercises
('Pull-ups', 'Upper body pulling movement', ARRAY['back', 'arms']::muscle_group[], 'bodyweight', false),
('Barbell Rows', 'Compound movement for back development', ARRAY['back', 'arms']::muscle_group[], 'barbell', false),
('Lat Pulldowns', 'Machine-based back exercise', ARRAY['back', 'arms']::muscle_group[], 'cable', false),

-- Legs exercises
('Squats', 'Fundamental lower body compound movement', ARRAY['legs']::muscle_group[], 'barbell', false),
('Romanian Deadlift', 'Hip-hinge movement for posterior chain', ARRAY['legs', 'back']::muscle_group[], 'barbell', false),
('Leg Press', 'Machine-based leg exercise', ARRAY['legs']::muscle_group[], 'machine', false),

-- Shoulders exercises
('Overhead Press', 'Vertical pressing movement', ARRAY['shoulders', 'arms']::muscle_group[], 'barbell', false),
('Lateral Raises', 'Isolation exercise for lateral deltoids', ARRAY['shoulders']::muscle_group[], 'dumbbell', false),

-- Arms exercises
('Bicep Curls', 'Isolation exercise for biceps', ARRAY['arms']::muscle_group[], 'dumbbell', false),
('Tricep Pushdowns', 'Isolation exercise for triceps', ARRAY['arms']::muscle_group[], 'cable', false),

-- Core exercises
('Plank', 'Isometric core exercise', ARRAY['core']::muscle_group[], 'bodyweight', false),
('Russian Twists', 'Rotational core exercise', ARRAY['core']::muscle_group[], 'bodyweight', false),

-- Full body exercises
('Deadlift', 'Compound movement engaging multiple muscle groups', ARRAY['full_body']::muscle_group[], 'barbell', false),
('Kettlebell Swings', 'Explosive full body movement', ARRAY['full_body']::muscle_group[], 'kettlebell', false),

-- Cardio exercises
('Running', 'Basic cardiovascular exercise', ARRAY['cardio']::muscle_group[], 'bodyweight', false),
('Jump Rope', 'High-intensity cardiovascular exercise', ARRAY['cardio']::muscle_group[], 'other', false);

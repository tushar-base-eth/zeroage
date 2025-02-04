# Database Schema

## Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Profiles Table
```sql
CREATE TABLE profiles (
  user_id UUID REFERENCES users(id),
  name TEXT,
  weight NUMERIC,
  height NUMERIC,
  body_fat NUMERIC,
  date_of_birth DATE,
  gender TEXT,
  unit TEXT CHECK (unit IN ('kg', 'lbs')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Exercises Table
```sql
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT,
  primary_muscle TEXT,
  secondary_muscles TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Workouts Table
```sql
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Workout Sets Table
```sql
CREATE TABLE workout_sets (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER REFERENCES workouts(id),
  exercise_id INTEGER REFERENCES exercises(id),
  set_number INTEGER,
  reps INTEGER,
  weight NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
# Functional Requirements

## Core Features

### 1. Singup/SignIn Authentication
- **Methods:** Email/password login and Google OAuth via Supabase Auth.

### 2. User Profile Management
- **Metrics:** Name, Unit [KG/LBS], Weight, height, body fat percentage, date of birth, and gender.
- **Editing:** Users can update profile details via a Settings page.

### 3. Workout Logging
- Users can select multiple predefined exercises.
- Edit sets/reps/weight for each exercise.
- Save workout session

### 4. Workout History
- Users should able to see their workout history.
- User can select a day in a calander to see their workout history for that day.
- User can scroll history to see previous days.

### 4. Dashboard
- User can see their total number of workouts and total volume.
- User can see volume for various muscles.
- **Range Selection:** Options include week, month, 6 months, and year.
- **Chart Display:** Horizontal scrollable cards show bar charts for each muscle group.
- **Calculation:** Aggregations are done in Supabase using SQL with proper indexing.
# Overview

## ZeroAge - Product Vision
A fitness app designed for easy workout logging, muscle volume tracking, and personal health metrics management. The app follows a modern, light-mode design with a white background and colorful icons, using Shadcn/UI guidelines for components. It's built mobile-first with future-proofing for API integrations and mobile apps.

## Core Objectives
- Simplify workout logging.
- Monitor progress through dashboard [charts/reports].

## Target Audience
Fitness enthusiasts who want a simple yet effective way to log workouts and monitor progress.

### Functional Requirements
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

### Database Schema
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

### Technical Architecture
# Technical Architecture

## Tech Stack
- **Frontend:** Next.js v14 (App Router), React 18, Tailwind CSS, Shadcn/UI (modern, light mode with white background and colorful icons), Zustand.
- **Backend:** Supabase (PostgreSQL, Supabase Auth, auto-generated APIs).
- **Deployment:** Vercel for the frontend; backend fully managed by Supabase.

## Project Structure & State Management
- **Pages:** Organized into modular components and screens.
- **State Management:** Centralized using Zustand.

## Performance Metrics (High-Level)
- **Page Load Times:** Targeting under 2 seconds for the dashboard.
- **API Response Times:** Aim for under 500ms on workout logging and under 1 second for chart generation.

## Future Proofing
- Designed to easily extend to native mobile apps and further API integrations.

### API Specifications
# API Specifications

## Endpoints Overview

### 1. User Authentication
- **POST /api/auth/signup**
  - **Request:** JSON containing email, password, and profile data.
  - **Response:** High-level confirmation with user details.
- **POST /api/auth/login**
  - **Request:** JSON containing email and password.
  - **Response:** JWT token and user data.

### 2. Workout Logging
- **POST /api/workouts**
  - **Request:** JSON with user ID, workout date, and an array of exercises (each with exercise ID and set details).
  - **Response:** Confirmation with a workout ID and success message.

### 3. Muscle Volume Aggregation
- **GET /api/muscle-volume?range=<range>**
  - **Description:** Returns an array of objects, each containing a primary muscle name and the total volume aggregated over the specified time range.
  - **Supported Ranges:**
    - `week`: Returns the total volume for each primary muscle over the last 7 days.
    - `month`: Returns the total volume for each primary muscle over the last 4 weeks.
    - `6month`: Returns the total volume for each primary muscle over the last 6 months.
    - `year`: Returns the total volume for each primary muscle over the last 12 months.
  - **Response Example:**
    ```json
    [
      { "primary_muscle": "Chest", "volume": 350 },
      { "primary_muscle": "Back", "volume": 420 },
      { "primary_muscle": "Legs", "volume": 500 }
    ]
    ```

### 4. Handling Incomplete Data in the API

#### Data Validation
- **Missing Data Detection**
  - The API validates workout entries for required fields:
    - Sets
    - Reps
    - Weight
  - Response includes `"data_status"` field:
    ```json
    {
      "data_status": "incomplete",
      "missing_fields": ["weight", "reps"]
    }
    ```

#### Default Value Handling
- **Numerical Fields**
  - Missing values default to `0`
  - Example:
    ```json
    {
      "set_number": 1,
      "reps": 0,      // Default value
      "weight": 0     // Default value
    }
    ```
- **String Fields**
  - Missing values default to `null`
  - API response includes warning flag

#### Client Handling
- Applications should prompt users to complete missing data
- Incomplete entries are marked visually in the UI
- Data synchronization occurs when missing fields are completed

### 5. API Error Handling
- High-level error responses are sufficient at this stage.

### Security and Validation
# Security and Validation

## Authentication & Access Control
- **Supabase Auth:** Email/password and Google OAuth.
- **Cookies:** Use HTTP-Only secure cookies for authentication tokens.

## Validation Strategy
- **Client-Side:** Utilize Zod with React Hook Form for input validation.
  ```typescript
  import { z } from 'zod';

  export const ProfileSchema = z.object({
    weight: z.number().min(30).max(300),
    height: z.number().min(100).max(250),
    body_fat: z.number().min(0).max(100),
    date_of_birth: z.date().refine(dob => new Date().getFullYear() - dob.getFullYear() >= 13),
    gender: z.enum(['Male', 'Female']),
  });
  ```
- **Server-Side:** Validate API inputs using the same schema.
- **Database-Level:** SQL constraints (e.g., CHECK constraints for valid weight and reps).

## Rate Limiting & Security Enhancements
- **Rate Limiting:** Apply middleware on authentication and sensitive endpoints.
- **Encryption:** Use TLS for data in transit and AES-256 for data at rest.
- **Error Boundaries:** Implement global error boundaries in React.

### Future Roadmap
# Future Roadmap
Vision is to have a one-stop health app that not only tracks cardio and sleep but also aims to help users reverse their aging.

## Planned Enhancements
- **Social Features:** Enable sharing workouts with friends.
- **Wearable Integration:** Sync with devices like Apple Watch and Fitbit.
- **AI-Powered Recommendations:** Generate personalized workout suggestions.
- **Mobile App:** Extend the current web app to native mobile platforms.

## Screen Designs

### Onboarding Page
# Onboarding Page

## Purpose
Landing page for users when they open the webapp.

## Layout & Design
- **Style:** Modern, light mode (white background, colorful icons) following Shadcn/UI guidelines.
- **Elements:**
  - Landing screen with app branding, a "Get Started" and "Login" button.

## Interactions
1. User lands on the onboarding screen.
2. Clicks "Get Started" to display the signup form.
3. Submits the form and is redirected to the login page.

## Sample Code Snippet
```jsx
function OnboardingPage() {
  return (
    <form>
      {/* Branding, log etc. */}
      <button type="submit">Get Started</button>
      <button type="submit">Login</button>
    </form>
  );
}
```

### Signup Page
# Signup Page

## Purpose
Introduce new users and capture basic profile details.

## Layout & Design
- **Style:** Modern, light mode (white background, colorful icons) following Shadcn/UI guidelines.
- **Elements:**
  - Signup form capturing name, unit[kg/lbs], weight, height, body fat %, date of birth, and gender.

## Interactions
1. User lands on the signup page after clicking "Get Started" from onboarding screen.
2. Submits the form and is redirected to the login page.

## Sample Code Snippet
```jsx
function SignUpPage() {
  return (
    <form>
      {/* Input fields for name, unit[kg/lbs], weight, height, etc. */}
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### SignIn Page
# SignIn Page

## Purpose
Exsiting users to login.

## Layout & Design
- **Style:** Modern, light mode (white background, colorful icons) following Shadcn/UI guidelines.
- **Elements:**
  - User start superbase authentication elements for regular username/password and Signin with Google.

## Interactions
1. User lands on the signin page after clicking "Login" from onboarding screen.

## Sample Code Snippet
```jsx
function SignUpPage() {
  return (
    <form>
      {/* Email/Password, OAuth etc. */}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Workout Page
# Workout Page

## Purpose
Enable users to create and log a workout session.

## Layout & Design
- **Style:** Modern, simple, light mode with a mobile-first approach.
- **Elements:**
  - Header with "Create New Workout" title.
  - A "+" button that opens a scrollable list of exercises where user can multiselect.
  - Scroallable list of selected exercises to add sets, reps, and weight.
  - "Log Workout" and "Back to Dashboard" buttons.

## Interactions
1. User taps "+" to select exercises.
2. Selected exercises gets added to the scroallable list.
3. Click on each exercise to input sets details.
4. User taps "Log Workout" to save the session.

## Sample Code Snippet
```jsx
function WorkoutPage() {
  return (
    <div>
      <h1>Create New Workout</h1>
      {/* Render exercise selection and details */}
      <button>Log Workout</button>
    </div>
  );
}
```

## Workout Logging & Day Association
- When the user presses "Log Workout", the system timestamps the session.
- The timestamp determines the date of the workout session (e.g., UTC or local time).
- This ensures that late-night logs don't shift into the next day incorrectly.

### Log Page
# Log Page

## Purpose
Allow users to view their past workout sessions.

## Layout & Design
- **Elements:**
  - A calendar widget for selecting dates.
  - A scrollable list of workouts with brief details (date, exercises, sets).
  - A modal to display full workout details.

## Interactions
1. User browses workouts via calendar or list.
2. Clicks on a workout to open detailed modal.

## Sample Code Snippet
```jsx
function LogPage() {
  return (
    <div>
      {/* Render calendar and workout list */}
    </div>
  );
}
```

### Dashboard Page
# Dashboard Page

## Purpose
Provide an overview of workout statistics and quick access to settings.

## Layout & Design
- **Style:** Consistent modern, light mode using Shadcn/UI.
- **Elements:**
  - Header with a settings (hamburger) icon in the right top corner.
  - muscle volume (with options for range select week, month, 6months and year).
  - charts for muscles which you can scroll through horizontally.

## Interactions
1. User views charts and summaries.
2. Taps the settings icon to access account/profile options.

## Sample Code Snippet
```jsx
function DashboardPage() {
  return (
    <div>
      <header>        
        {/* Render charts and workout summary */}
      </header>
      <div>
      {/* muscle volume title */}
      {/* muscle volume range selector */}
      {/* muscle volume chart */}
      </div>      
    </div>
  );
}
```
# Overview

## ZeroAge - Product Vision
A fitness webapp designed to help humans explore the next chapter of humanity where we are not only limited by physical boundaries but also by the limitations of our minds. This webapp is specifically designed to empower individuals to take control of their health and well-being, leading them on not only a path of physical fitness but also a path of self-discovery and well-being. This webapp aims to be a revolutionary AI friend that will motivate humans to live the best day of their lives every day by taking steps that are designed not to let them die. Every day based on their progress, the AI friend will recommend tasks tailored to their fitness level.


## Core Objectives
- Simplify workout logging.
- Workout history records.
- Achievements and progress tracking through dashboard [charts/reports/stats].

## Target Audience
- Humans who are interested to try something new and want to not only stay fit but reverse their aging.
- Fitness enthusiasts who want a simple yet effective way to log workouts and monitor progress.

### Functional Requirements
# Functional Requirements

## Core Features

### 1. Singup/SignIn Authentication
- **Methods:** Email/password login and Google OAuth via Supabase Auth.

### 2. User Profile/Settings Management
- **Profile Details:** Name, email, about meweight, height, body fat percentage, date of birth, and gender.
- **Settings:** theme, Unit [KG/LBS], time zone, location, race, ethinicity, feedback and logout.
- **Editing:** Users can update profile details via a Profile page.

### 3. Workout Logging
- User can log multiple workouts in a day.
- Each workout can have multiple exercises.
- Users can add exercises from a list of multiple predefined exercises.
  - User should be able to starred and unstar an exercise.
  - Starred exercises should appear at the top of the list.
  - User should be able to search for exercises by name.
  - Exercise list should have an option to group exercises based on muscle groups [primary/secondary].
- User can log multiple exercises for each workout.
- User can log multiple sets for each exercise.
- User can log different reps for each set.
- User can log different weight for each set.

### 4. Workout History
- Users should able to see their workouts history which will be displayed in scrollable card format in descending order of date.
  - Each workout should have a title, date, and a count of exercises with total volume.
   - Total volume should be calculated based on the sets and reps logged for each exercise.
   - Clicking on each workout should lead to a detailed view of the workout.
    - Detailed view should include title, date, exercises, sets, and weight/reps for each set. 
- User can select a day in a calander to see their workouts history for that day.
- Calenar should highlight days where user has logged a workout.
- For now, workout history is limited to read only.

### 4. Dashboard
- User can standard metrics to track progress for example, total number of workouts, total volume, streaks, etc.
- User can some interesting visualizations to track progress, such as volume for various muscles.
  - - **Range Selection:** Options include week, month, 6 months, and year.
  - - **Chart Display:** Horizontal scrollable cards show bar charts for each muscle group.
- User can also see a trendline of progressive overload of their muscles over time.


# Database Schema & API Specifications
- refer to 5-DatabaseAndAPI.md 

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
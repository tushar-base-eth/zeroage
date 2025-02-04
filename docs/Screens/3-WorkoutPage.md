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
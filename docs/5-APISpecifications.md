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

### 4. Fetch Workouts for Body Page Calculation
- **GET /api/workouts?date=YYYY-MM-DD**
  - **Description:** Called twice: Once for today, once for yesterday.
  - **Response Example:**
    ```json
    [
      {
        "workout_id": 123,
        "timestamp": "2025-02-03T18:30:00Z",
        "exercises": [
          {
            "exercise_id": 10,
            "name": "Bench Press",
            "primary_muscle": "Chest",
            "sets": [
              { "set_number": 1, "reps": 10, "weight": 80 },
              { "set_number": 2, "reps": 8, "weight": 85 },
              { "set_number": 3, "reps": 6, "weight": 90 }
            ]
          }
        ]
      }
    ]
    ```
  - **Processing Steps:**
    1. Compute total volume for each muscle.
    2. Sum up today + yesterday.
    3. Assign color intensity.

*Note: Error responses are described at a high level.*

### 5. Handling Incomplete Data in the API

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

### 6. API Error Handling
- High-level error responses are sufficient at this stage.
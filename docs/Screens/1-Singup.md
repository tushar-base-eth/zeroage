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
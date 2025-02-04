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
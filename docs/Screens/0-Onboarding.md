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
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
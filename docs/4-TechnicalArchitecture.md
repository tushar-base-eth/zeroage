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
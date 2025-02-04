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
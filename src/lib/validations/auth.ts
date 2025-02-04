import * as z from "zod"

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  unit: z.enum(["kg", "lbs"]),
  weight: z.number().min(20, "Weight must be at least 20").max(500),
  height: z.number().min(100, "Height must be at least 100cm").max(300),
  bodyFat: z.number().min(1).max(100).optional(),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

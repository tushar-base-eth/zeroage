export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          name: string
          weight: number
          height: number
          body_fat: number | null
          date_of_birth: string
          gender: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          weight: number
          height: number
          body_fat?: number
          date_of_birth: string
          gender: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          weight?: number
          height?: number
          body_fat?: number | null
          date_of_birth?: string
          gender?: string
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: number
          name: string
          primary_muscle: string
          secondary_muscles: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          primary_muscle: string
          secondary_muscles: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          primary_muscle?: string
          secondary_muscles?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: number
          user_id: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      workout_sets: {
        Row: {
          id: number
          workout_id: number
          exercise_id: number
          set_number: number
          reps: number
          weight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          workout_id: number
          exercise_id: number
          set_number: number
          reps: number
          weight: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          workout_id?: number
          exercise_id?: number
          set_number?: number
          reps?: number
          weight?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

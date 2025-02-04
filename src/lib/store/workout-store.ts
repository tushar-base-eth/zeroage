import { create } from 'zustand'
import { Workout } from '@/types/workout'
import { Exercise, ExerciseSet } from '@/types/exercise'

interface WorkoutState {
  currentWorkout: {
    date: string
    exercises: {
      exercise: Exercise
      sets: ExerciseSet[]
    }[]
  } | null
  workoutHistory: Workout[]
  isLoading: boolean
  setCurrentWorkout: (workout: WorkoutState['currentWorkout']) => void
  addSet: (exerciseId: string, set: Omit<ExerciseSet, 'id' | 'workoutId' | 'created_at'>) => void
  removeSet: (exerciseId: string, setNumber: number) => void
  setWorkoutHistory: (workouts: Workout[]) => void
  setLoading: (loading: boolean) => void
  resetCurrentWorkout: () => void
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkout: null,
  workoutHistory: [],
  isLoading: false,
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  addSet: (exerciseId, newSet) =>
    set((state) => {
      if (!state.currentWorkout) return state

      const exerciseIndex = state.currentWorkout.exercises.findIndex(
        (e) => e.exercise.id === exerciseId
      )

      if (exerciseIndex === -1) return state

      const updatedExercises = [...state.currentWorkout.exercises]
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: [...updatedExercises[exerciseIndex].sets, newSet as ExerciseSet],
      }

      return {
        currentWorkout: {
          ...state.currentWorkout,
          exercises: updatedExercises,
        },
      }
    }),
  removeSet: (exerciseId, setNumber) =>
    set((state) => {
      if (!state.currentWorkout) return state

      const exerciseIndex = state.currentWorkout.exercises.findIndex(
        (e) => e.exercise.id === exerciseId
      )

      if (exerciseIndex === -1) return state

      const updatedExercises = [...state.currentWorkout.exercises]
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedExercises[exerciseIndex].sets.filter(
          (_, index) => index !== setNumber
        ),
      }

      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: updatedExercises,
        },
      }
    }),
  setWorkoutHistory: (workouts) => set({ workoutHistory: workouts }),
  setLoading: (isLoading) => set({ isLoading }),
  resetCurrentWorkout: () => set({ currentWorkout: null }),
}))

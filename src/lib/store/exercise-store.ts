import { create } from 'zustand';
import type { Exercise } from '@/types/exercise';

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addExercise: (exercise: Exercise) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  isLoading: false,
  error: null,
  setExercises: (exercises) => set({ exercises }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addExercise: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, exercise],
    })),
}));

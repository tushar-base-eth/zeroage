import { create } from 'zustand'

interface UIState {
  selectedDate: Date | undefined
  workoutModalOpen: boolean
  setSelectedDate: (date: Date | undefined) => void
  setWorkoutModalOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedDate: undefined,
  workoutModalOpen: false,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setWorkoutModalOpen: (open) => set({ workoutModalOpen: open }),
}))

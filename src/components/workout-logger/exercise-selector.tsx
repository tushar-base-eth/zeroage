'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useExerciseStore } from '@/lib/store/exercise-store';
import type { Exercise } from '@/types/exercise';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { exercises, isLoading, setExercises, setLoading, setError } = useExerciseStore();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/exercises');
        if (!response.ok) throw new Error('Failed to fetch exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [setExercises, setLoading, setError]);

  const handleSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    onSelect(exercise);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedExercise ? selectedExercise.name : "Select exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search exercises..." />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup>
            {exercises.map((exercise) => (
              <CommandItem
                key={exercise.id}
                onSelect={() => handleSelect(exercise)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedExercise?.id === exercise.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {exercise.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

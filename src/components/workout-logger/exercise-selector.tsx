'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { Exercise } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  selectedExercise?: Exercise;
}

export function ExerciseSelector({ onSelect, selectedExercise }: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      const response = await fetch('/api/exercises');
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    },
  });

  if (isLoading) {
    return <ExerciseSelectorSkeleton />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExercise ? selectedExercise.name : 'Select exercise...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search exercises..." />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {exercises?.map((exercise) => (
              <CommandItem
                key={exercise.id}
                value={exercise.name}
                onSelect={() => {
                  onSelect(exercise);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedExercise?.id === exercise.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex flex-col">
                  <span>{exercise.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Primary: {exercise.primary_muscle}
                    {exercise.secondary_muscles?.length > 0 &&
                      ` | Secondary: ${exercise.secondary_muscles.join(', ')}`}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ExerciseSelectorSkeleton() {
  return <Skeleton className="h-10 w-full" />;
}

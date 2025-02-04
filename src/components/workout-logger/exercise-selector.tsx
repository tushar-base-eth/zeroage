'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Exercise } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onRemove: (exerciseId: number) => void;
  selectedExercises: Exercise[];
}

export function ExerciseSelector({ onSelect, onRemove, selectedExercises }: ExerciseSelectorProps) {
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
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedExercises.map((exercise) => (
          <Badge key={exercise.id} variant="secondary" className="flex items-center gap-1">
            {exercise.name}
            <button
              onClick={() => onRemove(exercise.id)}
              className="ml-1 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedExercises.length === 0 ? 'Select exercises...' : 'Add more exercises...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search exercises..." />
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {exercises?.map((exercise) => {
                const isSelected = selectedExercises.some(e => e.id === exercise.id);
                return (
                  <CommandItem
                    key={exercise.id}
                    value={exercise.name}
                    onSelect={() => {
                      if (!isSelected) {
                        onSelect(exercise);
                        setOpen(false);
                      }
                    }}
                    disabled={isSelected}
                    className={cn(isSelected && 'opacity-50')}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
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
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ExerciseSelectorSkeleton() {
  return <Skeleton className="h-10 w-full" />;
}

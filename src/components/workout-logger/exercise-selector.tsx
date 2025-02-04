'use client';

import { useEffect, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExerciseStore } from '@/lib/store/exercise-store';
import type { Exercise } from '@/types/exercise';
import { Input } from '@/components/ui/input';

interface ExerciseSelectorProps {
  onSelect?: (exercises: Exercise[]) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
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

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e.id === exercise.id);
      if (isSelected) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleAddExercises = () => {
    if (onSelect) {
      onSelect(selectedExercises);
    }
    setOpen(false);
    setSelectedExercises([]);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="space-y-4">
          <SheetTitle>Select Exercises</SheetTitle>
          <SheetDescription>
            Choose exercises to add to your workout
          </SheetDescription>
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 h-[calc(100%-10rem)]">
          <div className="space-y-2 pr-4">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedExercises.some(e => e.id === exercise.id);
              return (
                <Button
                  key={exercise.id}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => toggleExercise(exercise)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exercise.name}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button 
            onClick={handleAddExercises} 
            disabled={selectedExercises.length === 0}
            className="w-full"
          >
            Add {selectedExercises.length} Exercise{selectedExercises.length !== 1 ? 's' : ''}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

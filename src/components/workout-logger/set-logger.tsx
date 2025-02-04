'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { WorkoutSetInput } from '@/types/api';

interface SetLoggerProps {
  set: WorkoutSetInput;
  onUpdate: (updates: Partial<WorkoutSetInput>) => void;
  onRemove: () => void;
}

export function SetLogger({ set, onUpdate, onRemove }: SetLoggerProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 text-sm text-muted-foreground">
        #{set.set_number}
      </div>
      <Input
        type="number"
        placeholder="Weight"
        value={set.weight || ''}
        onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
        className="w-24"
      />
      <Input
        type="number"
        placeholder="Reps"
        value={set.reps || ''}
        onChange={(e) => onUpdate({ reps: Number(e.target.value) })}
        className="w-24"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { APIError } from '@/lib/api/api-service';
import type { ValidationError } from '@/lib/validations/schema';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | ValidationError[] | null;
}

export function useAsync<T>(initialData: T | null = null) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null
  });

  const execute = useCallback(async (promise: Promise<T>, options?: {
    successMessage?: string;
    errorMessage?: string;
  }) => {
    setState(current => ({ ...current, isLoading: true, error: null }));
    try {
      const data = await promise;
      setState({ data, isLoading: false, error: null });
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      return { data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = options?.errorMessage || 
        (error instanceof APIError ? error.message : 'An unexpected error occurred');
      
      setState(current => ({
        ...current,
        isLoading: false,
        error: error instanceof Error ? error : null
      }));
      
      toast.error(errorMessage);
      return { data: null, error };
    }
  }, []);

  return {
    ...state,
    execute
  };
}

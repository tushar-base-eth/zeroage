import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { AuthError } from '@supabase/supabase-js';

interface AuthResponse {
  error: AuthError | null;
}

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (!error) {
        router.refresh();
        router.push('/workout');
      }
      
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (!error) {
        router.refresh();
        router.push('/auth/signin');
      }
      
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        router.refresh();
        router.push('/');
      }
      
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading,
  };
}

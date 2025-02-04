import { toast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'default' | 'destructive';
}

export function useToast() {
  return {
    toast: ({ title, description, type = 'info', variant = 'default' }: ToastProps) => {
      if (type === 'success') {
        toast.success(title, { description });
      } else if (type === 'error') {
        toast.error(title, { description });
      } else if (type === 'warning') {
        toast.warning(title, { description });
      } else {
        toast.info(title, { description });
      }
    },
  };
}

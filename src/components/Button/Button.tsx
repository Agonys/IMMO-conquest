import { ComponentProps } from 'react';
import { cn } from '@/utils';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'filled' | 'ghost';
  children: React.ReactNode;
};

export const Button = ({ variant = 'filled', children, className, disabled, ...props }: ButtonProps) => {
  return (
    <button
      tabIndex={0}
      className={cn(
        'flex cursor-pointer items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-1 focus:outline-none',
        variant === 'filled' && 'bg-yellow-400 text-black brightness-90 hover:brightness-80',
        variant === 'outline' &&
          'border-badge-background text-foreground hover:border-yellow-light border-1 bg-transparent',
        variant === 'ghost' && 'border-0 bg-transparent',
        disabled && 'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

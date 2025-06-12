import { ComponentProps } from 'react';
import { cn } from '@/utils';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'filled';
  children: React.ReactNode;
};

export const Button = ({ variant = 'filled', children, className, disabled, ...props }: ButtonProps) => {
  return (
    <button
      tabIndex={1}
      className={cn(
        'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-yellow-400 focus:outline-none',
        variant === 'filled'
          ? 'bg-yellow-300 text-black hover:bg-yellow-400'
          : 'border-badge-background text-foreground hover:border-yellow-light border-1 bg-transparent',
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

import { ComponentProps } from 'react';
import { cn } from '@/utils';

export const Container = ({ children, className }: ComponentProps<'section'>) => {
  return (
    <section className={cn('relative container mx-auto flex items-center justify-center px-4 py-4', className)}>
      {children}
    </section>
  );
};

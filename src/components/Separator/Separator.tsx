import { ComponentProps } from 'react';
import { cn } from '@/utils';

export const Separator = ({ className }: ComponentProps<'div'>) => {
  return <div className={cn('bg-card-border h-px w-full shrink-0', className)} />;
};

import { ComponentProps } from 'react';
import { cn } from '@/utils';

interface BadgeBase {
  title: string;
  value: string | number;
  solid?: true;
}

type BadgeProps = BadgeBase & ComponentProps<'div'>;

export const Badge = ({ title = 'Badge', value = 'bly', solid, className }: BadgeProps) => {
  return (
    <div className={cn('flex overflow-hidden text-xs font-medium', className)}>
      <span className="w-max rounded-l-md bg-gray-700 px-2 py-1 capitalize">{title}</span>
      <span
        className={cn('rounded-r-md px-2 py-1', solid ? 'bg-gray-600 text-gray-300' : 'bg-gray-700/60 text-gray-400')}
      >
        {value}
      </span>
    </div>
  );
};

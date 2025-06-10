import { ComponentProps } from 'react';
import clsx from 'clsx';

export const Container = ({ children, className }: ComponentProps<'section'>) => {
  return (
    <section className={clsx('relative container mx-auto flex items-center justify-center px-4 py-4', className)}>
      {children}
    </section>
  );
};

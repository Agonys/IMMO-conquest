import { ComponentProps } from 'react';
import clsx from 'clsx';

export const Container = ({ children, className }: ComponentProps<'section'>) => {
  return <section className={clsx('container w-full py-6', className)}>{children}</section>;
};

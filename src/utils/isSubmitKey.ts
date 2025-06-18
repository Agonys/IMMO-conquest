import type { KeyboardEvent } from 'react';

export const isSubmitKey = <T>(event?: KeyboardEvent<T>): boolean => {
  return !!event && (event.key === 'Enter' || event.key === ' ');
};

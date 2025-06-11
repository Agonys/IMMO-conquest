import { type RefObject, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  extraRefs?: Array<RefObject<HTMLElement | null>>,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && ref.current.contains(event.target as Node)) return;
      if (extraRefs?.some((extraRef) => extraRef.current?.contains(event.target as Node))) {
        return;
      }
      handler();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler, extraRefs]);

  return ref;
}

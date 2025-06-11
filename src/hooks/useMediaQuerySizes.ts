import { useMemo } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';

export const useMediaQuerySizes = () => {
  const xs = useMediaQuery('only screen and (min-width: 576px)');
  const sm = useMediaQuery('only screen and (min-width: 640px)');
  const md = useMediaQuery('only screen and (min-width: 768px)');
  const lg = useMediaQuery('only screen and (min-width: 1024px)');
  const xl = useMediaQuery('only screen and (min-width: 1280px)');
  const xlExtended = useMediaQuery('only screen and (min-width: 1536px)');

  const screenSizes = useMemo(() => ({ xs, sm, md, lg, xl, xlExtended }), [xs, sm, md, lg, xl, xlExtended]);

  return { screenSizes };
};

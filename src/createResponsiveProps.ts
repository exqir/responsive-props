import { BreakpointMap } from './types';
import { getKeys } from './getKeys';
import { mq } from './mediaQuery';

type WithDefault<T> = T & { default: 0 };

export function createResponsiveProps<Breakpoints extends BreakpointMap>(
  breakpoints: Breakpoints
) {
  const sortedBreakpointKeys = getKeys(breakpoints).sort(
    (a, b) => breakpoints[a] - breakpoints[b]
  );
  const sortedBreakpoints = { default: 0 } as WithDefault<Breakpoints>;
  for (const key of sortedBreakpointKeys) {
    // @ts-ignore
    sortedBreakpoints[key] = breakpoints[key];
  }

  return {
    mq: mq(sortedBreakpoints),
  };
}

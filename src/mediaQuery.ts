import { BreakpointMap } from './types';

/**
 * Creates a function to get min-width based media queries for the provided breakpoint.
 * @param {Breakpoints} breakpoints
 * @returns {Function} (breakpoint: Key) => `@media (min-width ...)`
 */
export function mq<
  Breakpoints extends BreakpointMap,
  Key extends keyof Breakpoints
>(breakpoints: Breakpoints) {
  return (breakpoint: Key) =>
    `@media (min-width: ${breakpoints[breakpoint]}px)`;
}

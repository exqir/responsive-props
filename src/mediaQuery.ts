export type MediaQueryBreakpoint = 's' | 'm' | 'l' | 'xl';
export type Breakpoint = 'xs' | MediaQueryBreakpoint;
export type BreakpointMap = { [BP in Breakpoint]: number };

export const bps = {
  "s": 321,
  "m": 768,
  "l": 1024,
  "xl": 1280
}

export const breakpoints: BreakpointMap = {
  xs: 0,
  ...bps,
};

/**
 * Creates a min-width based media query for the provided breakpoint.
 * @param {MediaQueryBreakpoint} breakpoint
 * @returns {string} media query `@media (min-width ...)`
 */
export function mq(breakpoint: MediaQueryBreakpoint) {
  return `@media (min-width: ${breakpoints[breakpoint]}px)`;
}

import { getKeys } from '../src/getKeys';
import { mq, MediaQueryBreakpoint, bps } from '../src/mediaQuery';

export type BreakpointMap = { [BP in MediaQueryBreakpoint]: number };

describe('mediaQuery', () => {
  getKeys<BreakpointMap>(bps).forEach(bp => {
    it(`should return media query for breakpoint ${bp}`, () => {
      const result = mq(bp);

      expect(result).toEqual(`@media (min-width: ${bps[bp]}px)`);
    });
  });
});

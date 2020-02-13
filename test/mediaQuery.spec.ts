import { mq } from '../src/mediaQuery';

const breakpoints = {
  small: 100,
  medium: 500,
  large: 600,
};

describe('mediaQuery', () => {
  it.each<'small' | 'medium' | 'large'>(['small', 'medium', 'large'])(
    `should return media query for breakpoint %s`,
    bp => {
      const result = mq(breakpoints)(bp);

      expect(result).toEqual(`@media (min-width: ${breakpoints[bp]}px)`);
    }
  );
});

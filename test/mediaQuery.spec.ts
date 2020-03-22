import { mq as createMq } from '../src/mediaQuery';

const breakpoints = {
  small: 100,
  medium: 500,
  large: 600,
};

const mq = createMq(breakpoints);

describe('mediaQuery', () => {
  it.each<'small' | 'medium' | 'large'>(['small', 'medium', 'large'])(
    `should return media query for breakpoint %s`,
    bp => {
      const result = mq(bp);

      expect(result).toEqual(`@media (min-width: ${breakpoints[bp]}px)`);
    }
  );
});

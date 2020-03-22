import { responsiveProp as createResponsiveProp } from '../src/responsiveProp';

type Value = 'value' | 'default';
type Option = 'some' | 'none';

const breakpoints = {
  default: 0,
  small: 100,
  medium: 500,
  large: 600,
};

const responsiveProp = createResponsiveProp(breakpoints);

describe('responsiveProp', () => {
  describe('provide props to callback', () => {
    it('should call callback with default value if prop is undefined', () => {
      const callback = jest.fn();

      responsiveProp(undefined, 'default', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('default');
    });

    it('should call callback with value if prop is not an responsive object', () => {
      const callback = jest.fn();

      responsiveProp<Value>('value', 'default', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('value');
    });

    it('should call callback with value if only default is defined in responsive object', () => {
      const callback = jest.fn();

      responsiveProp<Value>({ default: 'value' }, 'default', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('value');
    });

    it('should call callback with default value and value for breakpoint if only none default breakpoints are defined in responsive object', () => {
      const callback = jest.fn();

      responsiveProp<Value>({ small: 'value' }, 'default', callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('default');
      expect(callback).toHaveBeenCalledWith('value');
    });
  });

  describe('mediaQueries', () => {
    it('should allow returning empty rule from callback', () => {
      const result = responsiveProp<undefined>(
        undefined,
        undefined,
        () => undefined
      );

      expect(result).toEqual('');
    });

    it('should return callback results wrapped in mediaQueries if prop is an responsive object', () => {
      const result = responsiveProp<string>(
        { small: 'small', medium: 'medium', large: 'large' },
        'default',
        prop => prop
      );

      expect(result).toContain('default');
      expect(result).toContain(
        `@media (min-width: ${breakpoints.small}px) { small }`
      );
      expect(result).toContain(
        `@media (min-width: ${breakpoints.medium}px) { medium }`
      );
      expect(result).toContain(
        `@media (min-width: ${breakpoints.large}px) { large }`
      );
    });

    it('should return callback results wrapped in mediaQueries if multiple props are responsive objects', () => {
      const result = responsiveProp<string, string>(
        [
          {
            small: 'first_small',
            medium: 'first_medium',
            large: 'first_large',
          },
          {
            small: 'second_small',
            medium: 'second_medium',
            large: 'second_large',
          },
        ],
        ['first_default', 'second_default'],
        (firstProp, secondProp) => `${firstProp} | ${secondProp}`
      );

      expect(result).toContain('first_default | second_default');
      expect(result).toContain(
        `@media (min-width: ${breakpoints.small}px) { first_small | second_small }`
      );
      expect(result).toContain(
        `@media (min-width: ${breakpoints.medium}px) { first_medium | second_medium }`
      );
      expect(result).toContain(
        `@media (min-width: ${breakpoints.large}px) { first_large | second_large }`
      );
    });
  });

  describe('provide multiple props to callback', () => {
    it('should call callback with all values if props are not responsive objects', () => {
      const callback = jest.fn();

      responsiveProp<Value, Option>(
        ['value', 'some'],
        ['default', 'none'],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('value', 'some');
    });

    it('should call callback with multiple props with all values if props are responsive objects', () => {
      const callback = jest.fn();

      responsiveProp<string, string, boolean, string>(
        [
          { small: 'first_small' },
          { small: 'second_small', large: 'second_large' },
          true,
          { small: 'fourth_small', medium: 'fourth_medium' },
        ],
        ['first_default', 'second_default', false, 'fourth_default'],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith(
        'first_default',
        'second_default',
        true,
        'fourth_default'
      );
      expect(callback).toHaveBeenCalledWith(
        'first_small',
        'second_small',
        true,
        'fourth_small'
      );
      expect(callback).toHaveBeenCalledWith(
        'first_small',
        'second_small',
        true,
        'fourth_medium'
      );
      expect(callback).toHaveBeenCalledWith(
        'first_small',
        'second_large',
        true,
        'fourth_medium'
      );
    });

    it('should call callback with all value permutations if first prop has more breakpoints', () => {
      const callback = jest.fn();

      responsiveProp<string, string>(
        [
          {
            small: 'first_small',
            medium: 'first_medium',
            large: 'first_large',
          },
          { small: 'second_small', large: 'second_large' },
        ],
        ['first_default', 'second_default'],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('first_default', 'second_default');
      expect(callback).toHaveBeenCalledWith('first_small', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_medium', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_large', 'second_large');
    });

    it('should call callback with all value permutations if subsequent props have more breakpoints', () => {
      const callback = jest.fn();

      responsiveProp<string, string>(
        [
          { medium: 'first_medium' },
          { small: 'second_small', large: 'second_large' },
        ],
        ['first_default', 'second_default'],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('first_default', 'second_default');
      expect(callback).toHaveBeenCalledWith('first_default', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_medium', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_medium', 'second_large');
    });

    it('should allow subsequent props to be undefined', () => {
      const callback = jest.fn();

      responsiveProp<string, string | undefined>(
        [{ large: 'first_large' }, undefined],
        ['first_default', undefined],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('first_default', undefined);
      expect(callback).toHaveBeenCalledWith('first_large', undefined);
    });

    it('should allow first prop using default and subsequent props to be undefined', () => {
      const callback = jest.fn();

      responsiveProp<string | undefined, string | undefined>(
        [undefined, undefined],
        ['first_default', undefined],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('first_default', undefined);
    });

    it('should allow breakpoints in responsive props to be provided in any order', () => {
      const callback = jest.fn();

      responsiveProp<string, string>(
        [
          { medium: 'first_medium' },
          { large: 'second_large', small: 'second_small' },
        ],
        ['first_default', 'second_default'],
        callback
      );

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('first_default', 'second_default');
      expect(callback).toHaveBeenCalledWith('first_default', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_medium', 'second_small');
      expect(callback).toHaveBeenCalledWith('first_medium', 'second_large');
    });
  });

  describe('object as props', () => {
    it('should allow objects as prop if they do not use breakpoints as keys', () => {
      const callback = jest.fn();

      responsiveProp<{ width: number; height: number } | undefined>(
        { width: 1, height: 2 },
        undefined,
        callback
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ width: 1, height: 2 });
    });

    it('should allow objects as responsive props if they do not use breakpoints as keys', () => {
      const callback = jest.fn();

      responsiveProp<{ width: number; height: number } | undefined>(
        { medium: { width: 3, height: 4 } },
        { width: 1, height: 2 },
        callback
      );

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith({ width: 1, height: 2 });
      expect(callback).toHaveBeenCalledWith({ width: 3, height: 4 });
    });
  });
});

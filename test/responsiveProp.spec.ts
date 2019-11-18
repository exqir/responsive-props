import { responsiveProp } from '../src/responsiveProp';

describe('responsiveProp', () => {
  it('should use defaultValue if prop is undefined', () => {
    const result = responsiveProp(undefined, 'bar', prop => `foo: ${prop};`);

    expect(result).toEqual('foo: bar;');
  });

  it('should allow returning empty rule', () => {
    const result = responsiveProp<string | undefined>(
      undefined,
      undefined,
      prop => prop && `foo: ${prop};`
    );

    expect(result).toEqual('');
  });

  it('should return value if prop is not an object', () => {
    const result = responsiveProp('bar', 'tar', prop => `foo: ${prop};`);

    expect(result).toEqual('foo: bar;');
  });

  it('should return value if only xs is defined in responsive object', () => {
    const result = responsiveProp(
      { xs: 'bar' },
      'tar',
      prop => `foo: ${prop};`
    );

    expect(result).toEqual('foo: bar;');
  });

  it('should use default value if only one breakpoint is defined in responsive object', () => {
    const result = responsiveProp({ s: 'bar' }, 'tar', prop => `foo: ${prop};`);

    expect(result).toEqual('foo: tar; @media (min-width: 321px) { foo: bar; }');
  });

  it('should return mediaQueries if prop is an responsive object', () => {
    const result = responsiveProp(
      { xl: 'tar', s: 'bar' },
      'zar',
      prop => `foo: ${prop};`
    );

    expect(result).toEqual(
      'foo: zar; @media (min-width: 321px) { foo: bar; } @media (min-width: 1280px) { foo: tar; }'
    );
  });

  it('should return value if props are primitives', () => {
    const result = responsiveProp<string, string>(
      ['medium', 'column'],
      ['default', 'default'],
      (prop, direction) => prop && `${direction}: ${prop};`
    );

    expect(result).toEqual('column: medium;');
  });

  it('should create styles for every permutation if main prop has more breakpoints', () => {
    const result = responsiveProp<string, string>(
      [
        { xs: 'medium', l: 'large', xl: 'small' },
        { xs: 'column', xl: 'row' },
      ],
      ['default', 'default'],
      (prop, direction) => `${direction}: ${prop};`
    );

    expect(result).toEqual(
      'column: medium; @media (min-width: 1024px) { column: large; } @media (min-width: 1280px) { row: small; }'
    );
  });

  it('should create styles for every permutation if dependency prop has more breakpoints', () => {
    const result = responsiveProp<string, string>(
      [{ l: 'medium' }, { xs: 'column', xl: 'row' }],
      ['small', 'default'],
      (prop, direction) => `${direction}: ${prop};`
    );

    expect(result).toEqual(
      'column: small; @media (min-width: 1024px) { column: medium; } @media (min-width: 1280px) { row: medium; }'
    );
  });

  it('should provide multiple dependencies to callback', () => {
    const result = responsiveProp<string, string, boolean, string>(
      [
        { l: 'medium' },
        { xs: 'column', xl: 'row' },
        true,
        { s: 'px', xl: 'em' },
      ],
      ['small', 'default', false, 'rem'],
      (prop, direction, other, unit) =>
        `${direction}${other ? '' : '-reverse'}: ${prop} ${unit};`
    );

    expect(result).toEqual(
      'column: small rem; @media (min-width: 321px) { column: small px; } @media (min-width: 1024px) { column: medium px; } @media (min-width: 1280px) { row: medium em; }'
    );
  });

  it('should allow dependencies to be undefined', () => {
    const result = responsiveProp<string, string | undefined>(
      [{ l: 'bar' }, undefined],
      ['default', undefined],
      (prop, direction) => `foo${direction ? '-direction' : ''}: ${prop};`
    );

    expect(result).toEqual(
      'foo: default; @media (min-width: 1024px) { foo: bar; }'
    );
  });

  it('should allow main prop using a fallback and dependencies be undefined', () => {
    const result = responsiveProp<string | undefined, string | undefined>(
      [undefined, undefined],
      ['default', undefined],
      (prop, direction) => `foo${direction ? '-direction' : ''}: ${prop};`
    );

    expect(result).toEqual('foo: default;');
  });

  it('should allow main prop and dependencies be optional', () => {
    const result = responsiveProp<string | undefined, string | undefined>(
      [undefined, undefined],
      [undefined, undefined],
      (prop, direction) => (prop || direction ? 'yeah' : 'ney')
    );

    expect(result).toEqual('ney');
  });

  it('should allow objects as prop if they do not use breakpoints as keys', () => {
    const result = responsiveProp<
      { width: number; height: number } | undefined
    >(
      { width: 1, height: 2 },
      undefined,
      prop => prop && `width: ${prop.width}; height: ${prop.height};`
    );

    expect(result).toEqual('width: 1; height: 2;');
  });

  it('should allow objects as responsive prop', () => {
    const result = responsiveProp<
      { width: number; height: number } | undefined
    >(
      { m: { width: 4, height: 5 } },
      { width: 1, height: 2 },
      prop => prop && `width: ${prop.width}; height: ${prop.height};`
    );

    expect(result).toEqual(
      'width: 1; height: 2; @media (min-width: 768px) { width: 4; height: 5; }'
    );
  });
});

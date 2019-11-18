import { getKeys } from '../src/getKeys';

describe('getKeys', () => {
  it('should return an array of the keys', () => {
    const result = getKeys({ foo: 1, bar: 2 });

    expect(result).toEqual(['foo', 'bar']);
  });

  it('should return an empty array for an empty object', () => {
    const result = getKeys({});

    expect(result).toEqual([]);
  });

  it('should return indexes for a string', () => {
    const result = getKeys('foo');

    expect(result).toEqual(['0', '1', '2']);
  });

  it('should return indexes for an array', () => {
    const result = getKeys([1]);

    expect(result).toEqual(['0']);
  });

  it('should return an empty array for a primitive not supporting Object.keys', () => {
    const result = getKeys(1);

    expect(result).toEqual([]);
  });
});

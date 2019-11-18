import { mq, breakpoints, Breakpoint } from './mediaQuery';
import { getKeys } from './getKeys';

type ResponsiveObject<T> = { [BP in Breakpoint]?: T };
interface ResponsiveObjectDefault<T> extends ResponsiveObject<T> {
  xs: T;
}
export type ResponsiveProp<T> = T | ResponsiveObject<T>;

function isReponsiveObject<T>(prop: ResponsiveObject<T>) {
  return (
    Object.prototype.hasOwnProperty.call(prop, 'xs') ||
    Object.prototype.hasOwnProperty.call(prop, 's') ||
    Object.prototype.hasOwnProperty.call(prop, 'm') ||
    Object.prototype.hasOwnProperty.call(prop, 'l') ||
    Object.prototype.hasOwnProperty.call(prop, 'xl')
  );
}

function normalizeReponsiveProp<T>(
  prop: ResponsiveProp<T> | undefined,
  defaultValue: T
) {
  if (typeof prop === 'object' && isReponsiveObject(prop)) {
    const propWithDefault: ResponsiveObjectDefault<T> = {
      xs: defaultValue,
      ...prop,
    };
    return propWithDefault;
  }
  const normalized: ResponsiveObjectDefault<T> = {
    xs: prop !== undefined ? (prop as T) : defaultValue,
  };
  return normalized;
}

function sortBreakpoints<T>(obj: ResponsiveObject<T>) {
  return getKeys(obj).sort((a, b) => breakpoints[a] - breakpoints[b]);
}

function wrapInMq(breakpoint: Breakpoint, style?: string) {
  if (!style) return undefined;
  if (breakpoint === 'xs') return style;
  return `${mq(breakpoint)} { ${style} }`;
}

function getNextSmallerBreakpoint<T>(
  bp: Breakpoint,
  prop: ResponsiveObjectDefault<T>,
  bpList = getKeys(breakpoints),
  index = bpList.findIndex(b => b === bp)
): T {
  return Object.prototype.hasOwnProperty.call(prop, bp)
    ? prop[bp]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
    : getNextSmallerBreakpoint(bpList[index - 1], prop, bpList, index - 1);
}

function arrayify<T>(prop: T | any[], defaultValue: T | any[]) {
  const propArray = Array.isArray(prop) ? prop : [prop];
  const defaultArray = Array.isArray(defaultValue)
    ? defaultValue
    : [defaultValue];
  return propArray.map((property, index) =>
    normalizeReponsiveProp(property, defaultArray[index])
  );
}

/**
 * Allows prop to accept an ResponsiveProp consisting of either a value or an ResponsiveObject of
 * the shape { xs?: T, s?: T, m?: T, l?: T, xl?: T, }.
 * Prop parameter can also be an array of multiple ResponsiveProps.
 * @param {T | [T1, Tn]} prop A ResponsiveProp or array of ResponsiveProps.
 * @param {T | [T1, Tn]} defaultValue The default value for the ResponsiveProp.
 * @param {(prop: T, propN?: Tn ) => string} callback Function receiving the value of all props as parameter for each breakpoint
 * @returns {string} CSS rules to be applied for the defined breakpoints
 */
export function responsiveProp<P0>(
  prop: ResponsiveProp<P0> | undefined,
  defaultValue: P0,
  callback: (...prop: [P0]) => string | undefined
): string;
export function responsiveProp<P0, P1>(
  prop: [ResponsiveProp<P0>, ResponsiveProp<P1>],
  defaultValue: [P0, P1],
  callback: (...prop: [P0, P1]) => string | undefined
): string;
export function responsiveProp<P0, P1, P2>(
  prop: [ResponsiveProp<P0>, ResponsiveProp<P1>, ResponsiveProp<P2>],
  defaultValue: [P0, P1, P2],
  callback: (...prop: [P0, P1, P2]) => string | undefined
): string;
export function responsiveProp<P0, P1, P2, P3>(
  prop: [
    ResponsiveProp<P0>,
    ResponsiveProp<P1>,
    ResponsiveProp<P2>,
    ResponsiveProp<P3>
  ],
  defaultValue: [P0, P1, P2, P3],
  callback: (...prop: [P0, P1, P2, P3]) => string | undefined
): string;
export function responsiveProp<P0, P1, P2, P3, P4>(
  prop: [
    ResponsiveProp<P0>,
    ResponsiveProp<P1>,
    ResponsiveProp<P2>,
    ResponsiveProp<P3>,
    ResponsiveProp<P4>
  ],
  defaultValue: [P0, P1, P2, P3, P4],
  callback: (...prop: [P0, P1, P2, P3, P4]) => string | undefined
): string;
export function responsiveProp<T>(
  prop: ResponsiveProp<T> | ResponsiveProp<any>[] | undefined,
  defaultValue: T | any[],
  callback: (...prop: any[]) => string | undefined
) {
  const normalized = arrayify(prop, defaultValue);
  const allBreakpoints = normalized.reduce(
    (acc, dep) => ({ ...acc, ...dep }),
    {}
  );

  return sortBreakpoints(allBreakpoints)
    .map(bp =>
      wrapInMq(
        bp,
        callback(...normalized.map(p => getNextSmallerBreakpoint(bp, p)))
      )
    )
    .filter(Boolean)
    .join(' ');
}

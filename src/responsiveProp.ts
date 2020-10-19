import {
  BreakpointMap,
  ResponsiveObject,
  ResponsiveObjectDefault,
  ResponsiveProp,
} from '../types/types';
import { mq } from './mediaQuery';
import { getKeys } from './getKeys';

export function responsiveProp<Breakpoints extends BreakpointMap>(
  breakpoints: Breakpoints
) {
  const breakpointsWithDefault = { default: 0, ...breakpoints };

  function sortBreakpoints<T>(obj: ResponsiveObject<T, Breakpoints>) {
    return getKeys(obj).sort(
      (a, b) => breakpointsWithDefault[a] - breakpointsWithDefault[b]
    );
  }

  function wrapInMq(breakpoint: keyof Breakpoints, style?: string) {
    if (!style) return undefined;
    if (breakpointsWithDefault[breakpoint] === 0) return style;
    return `${mq(breakpointsWithDefault)(breakpoint)} { ${style} }`;
  }

  function getNextSmallerBreakpoint<T>(
    bp: keyof Breakpoints,
    prop: ResponsiveObjectDefault<T, Breakpoints>,
    bpList = getKeys(breakpointsWithDefault),
    index = bpList.findIndex(b => b === bp)
  ): T {
    return Object.prototype.hasOwnProperty.call(prop, bp)
      ? prop[bp]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      : getNextSmallerBreakpoint(bpList[index - 1], prop, bpList, index - 1);
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
  function responsiveProp<P0>(
    prop: ResponsiveProp<P0, Breakpoints> | undefined,
    defaultValue: P0,
    callback: (...prop: [P0]) => string | undefined
  ): string;
  function responsiveProp<P0, P1>(
    prop: [ResponsiveProp<P0, Breakpoints>, ResponsiveProp<P1, Breakpoints>],
    defaultValue: [P0, P1],
    callback: (...prop: [P0, P1]) => string | undefined
  ): string;
  function responsiveProp<P0, P1, P2>(
    prop: [
      ResponsiveProp<P0, Breakpoints>,
      ResponsiveProp<P1, Breakpoints>,
      ResponsiveProp<P2, Breakpoints>
    ],
    defaultValue: [P0, P1, P2],
    callback: (...prop: [P0, P1, P2]) => string | undefined
  ): string;
  function responsiveProp<P0, P1, P2, P3>(
    prop: [
      ResponsiveProp<P0, Breakpoints>,
      ResponsiveProp<P1, Breakpoints>,
      ResponsiveProp<P2, Breakpoints>,
      ResponsiveProp<P3, Breakpoints>
    ],
    defaultValue: [P0, P1, P2, P3],
    callback: (...prop: [P0, P1, P2, P3]) => string | undefined
  ): string;
  function responsiveProp<P0, P1, P2, P3, P4>(
    prop: [
      ResponsiveProp<P0, Breakpoints>,
      ResponsiveProp<P1, Breakpoints>,
      ResponsiveProp<P2, Breakpoints>,
      ResponsiveProp<P3, Breakpoints>,
      ResponsiveProp<P4, Breakpoints>
    ],
    defaultValue: [P0, P1, P2, P3, P4],
    callback: (...prop: [P0, P1, P2, P3, P4]) => string | undefined
  ): string;
  function responsiveProp<T>(
    prop:
      | ResponsiveProp<T, Breakpoints>
      | ResponsiveProp<any, Breakpoints>[]
      | undefined,
    defaultValue: T | any[],
    callback: (...prop: any[]) => string | undefined
  ) {
    const normalizedProps = normalizeProps(
      prop,
      defaultValue,
      breakpointsWithDefault
    );
    const combinedBreakpoints = normalizedProps.reduce(
      (acc, dep) => ({ ...acc, ...dep }),
      {}
    );

    return sortBreakpoints(combinedBreakpoints)
      .map(bp =>
        wrapInMq(
          bp,
          callback(...normalizedProps.map(p => getNextSmallerBreakpoint(bp, p)))
        )
      )
      .filter(Boolean)
      .join(' ');
  }

  return responsiveProp;
}

function normalizeProps<P0, Breakpoints extends BreakpointMap>(
  prop: P0,
  defaultValue: P0,
  props: Breakpoints
): [ResponsiveObjectDefault<P0, Breakpoints>];
function normalizeProps<P0, P1, Breakpoints extends BreakpointMap>(
  prop: [P0, P1],
  defaultValue: [P0, P1],
  props: Breakpoints
): [
  ResponsiveObjectDefault<P0, Breakpoints>,
  ResponsiveObjectDefault<P1, Breakpoints>
];
function normalizeProps<P0, P1, P2, Breakpoints extends BreakpointMap>(
  prop: [P0, P1, P2],
  defaultValue: [P0, P1, P2],
  props: Breakpoints
): [
  ResponsiveObjectDefault<P0, Breakpoints>,
  ResponsiveObjectDefault<P1, Breakpoints>,
  ResponsiveObjectDefault<P2, Breakpoints>
];
function normalizeProps<P0, P1, P2, P3, Breakpoints extends BreakpointMap>(
  prop: [P0, P1, P2, P3],
  defaultValue: [P0, P1, P2, P3],
  props: Breakpoints
): [
  ResponsiveObjectDefault<P0, Breakpoints>,
  ResponsiveObjectDefault<P1, Breakpoints>,
  ResponsiveObjectDefault<P2, Breakpoints>,
  ResponsiveObjectDefault<P3, Breakpoints>
];
function normalizeProps<P0, P1, P2, P3, P4, Breakpoints extends BreakpointMap>(
  prop: [P0, P1, P2, P3, P4],
  defaultValue: [P0, P1, P2, P3, P4],
  props: Breakpoints
): [
  ResponsiveObjectDefault<P0, Breakpoints>,
  ResponsiveObjectDefault<P1, Breakpoints>,
  ResponsiveObjectDefault<P2, Breakpoints>,
  ResponsiveObjectDefault<P3, Breakpoints>,
  ResponsiveObjectDefault<P4, Breakpoints>
];
function normalizeProps<T, Breakpoints extends BreakpointMap>(
  prop: T | any[],
  defaultValue: T | any[],
  props: Breakpoints
) {
  const propArray = Array.isArray(prop) ? prop : [prop];
  const defaultArray = Array.isArray(defaultValue)
    ? defaultValue
    : [defaultValue];
  return propArray.map((property, index) =>
    normalizeReponsiveProp(property, defaultArray[index], props)
  );
}

function normalizeReponsiveProp<T, Breakpoints extends BreakpointMap>(
  prop: ResponsiveProp<T, Breakpoints> | undefined,
  defaultValue: T,
  props: Breakpoints
): ResponsiveObjectDefault<T, Breakpoints> {
  if (typeof prop === 'object' && isReponsiveObject(prop, props)) {
    return {
      default: defaultValue,
      ...prop,
    };
  }
  return {
    default: prop !== undefined ? prop : defaultValue,
  };
}

function isReponsiveObject<T, Breakpoints extends BreakpointMap>(
  prop: ResponsiveObject<T, Breakpoints>,
  breakpoints: Breakpoints
): prop is ResponsiveObject<T, Breakpoints> {
  if (Object.prototype.hasOwnProperty.call(prop, 'default')) return true;
  for (const key of getKeys(breakpoints)) {
    if (Object.prototype.hasOwnProperty.call(prop, key)) return true;
  }
  return false;
}

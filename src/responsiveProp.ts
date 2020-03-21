import { BreakpointMap } from './types';
import { mq } from './mediaQuery';
import { getKeys } from './getKeys';

type ResponsiveObject<T, Breakpoints extends BreakpointMap> = {
  [BP in keyof Breakpoints]?: T;
} & { default?: T };

type ResponsiveObjectDefault<
  T,
  Breakpoints extends BreakpointMap
> = ResponsiveObject<T, Breakpoints> & { default: T };

export type ResponsiveProp<T, Breakpoints extends BreakpointMap> =
  | T
  | ResponsiveObject<T, Breakpoints>;

export function responsiveProp<Breakpoints extends BreakpointMap>(
  breakpoints: Breakpoints
) {
  function isReponsiveObject<T>(prop: ResponsiveObject<T, Breakpoints>) {
    if (Object.prototype.hasOwnProperty.call(prop, 'default')) return true;
    for (const key of getKeys(breakpoints)) {
      if (Object.prototype.hasOwnProperty.call(prop, key)) return true;
    }
    return false;
  }

  function normalizeReponsiveProp<T>(
    prop: ResponsiveProp<T, Breakpoints> | undefined,
    defaultValue: T
  ) {
    if (typeof prop === 'object' && isReponsiveObject(prop)) {
      const propWithDefault: ResponsiveObjectDefault<T, Breakpoints> = {
        default: defaultValue,
        ...prop,
      };
      return propWithDefault;
    }
    const normalized: ResponsiveObjectDefault<T, Breakpoints> = {
      default: prop !== undefined ? (prop as T) : defaultValue,
    };
    return normalized;
  }

  function sortBreakpoints<T>(obj: ResponsiveObject<T, Breakpoints>) {
    return getKeys(obj).sort((a, b) => breakpoints[a] - breakpoints[b]);
  }

  function wrapInMq(breakpoint: keyof Breakpoints, style?: string) {
    if (!style) return undefined;
    if (breakpoint === 'default') return style;
    return `${mq(breakpoints)(breakpoint)} { ${style} }`;
  }

  function getNextSmallerBreakpoint<T>(
    bp: keyof Breakpoints,
    prop: ResponsiveObjectDefault<T, Breakpoints>,
    bpList = getKeys(breakpoints),
    index = bpList.findIndex(b => b === bp)
  ): T {
    return Object.prototype.hasOwnProperty.call(prop, bp)
      ? prop[bp]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      : getNextSmallerBreakpoint(bpList[index - 1], prop, bpList, index - 1);
  }

  function normalize<T>(prop: T | any[], defaultValue: T | any[]) {
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
    const normalized = normalize(prop, defaultValue);
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

  return responsiveProp;
}

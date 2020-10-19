export type BreakpointMap = {
  [breakpoint: string]: number;
};

export type ResponsiveObject<T, Breakpoints extends BreakpointMap> = {
  [BP in keyof Breakpoints]?: T;
} & { default?: T };

export type ResponsiveObjectDefault<
  T,
  Breakpoints extends BreakpointMap
> = ResponsiveObject<T, Breakpoints> & { default: T };

export type ResponsiveProp<T, Breakpoints extends BreakpointMap> =
  | T
  | ResponsiveObject<T, Breakpoints>;

/** Pixel widths aligned with `globals.css` `@theme` breakpoints — use in JS/media queries */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointName = keyof typeof breakpoints;

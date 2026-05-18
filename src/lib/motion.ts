/** Subtle timings — avoids bouncy “template” motion */
export const transitions = {
  luxury: {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  micro: {
    duration: 0.2,
    ease: [0.33, 1, 0.68, 1] as const,
  },
} as const;

export const fadeDrift = {
  rest: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0 },
} as const;

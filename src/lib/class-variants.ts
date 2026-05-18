import { cva, type VariantProps } from "class-variance-authority";

/** Shared interaction surface for cards & links — subtle lift, no flash */
export const luxurySurface = cva(
  "transition-luxury border-border/50 bg-transparent",
  {
    variants: {
      interactive: {
        true: [
          "hover:border-border hover:shadow-soft",
          "active:translate-y-px active:transition-none",
        ],
        false: "",
      },
    },
    defaultVariants: { interactive: true },
  },
);

export type LuxurySurfaceVariants = VariantProps<typeof luxurySurface>;

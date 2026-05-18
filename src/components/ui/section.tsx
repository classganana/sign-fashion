import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      none: "",
      sm: "py-[length:var(--spacing-section-sm)]",
      md: "py-[length:var(--spacing-section-md)]",
      lg: "py-[length:var(--spacing-section-lg)]",
    },
    bleed: {
      false: "",
      /** Edge-to-edge within viewport (pair with Container inside for gutters) */
      true: "",
    },
    tone: {
      default: "",
      muted: "bg-muted/35",
      card: "bg-card/70",
      borderTop: "border-border/70 border-t",
    },
  },
  defaultVariants: {
    spacing: "md",
    bleed: false,
    tone: "default",
  },
});

export type SectionProps = ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof sectionVariants>;

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, bleed, tone, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, bleed, tone }), className)}
      {...props}
    />
  ),
);

Section.displayName = "Section";

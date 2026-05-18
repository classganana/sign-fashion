import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva(
  "mx-auto w-full px-[length:var(--spacing-gutter)] sm:px-[length:var(--spacing-gutter-lg)]",
  {
    variants: {
      size: {
        default: "max-w-[var(--breakpoint-xl)]",
        narrow: "max-w-[var(--breakpoint-lg)]",
        prose: "max-w-3xl",
        full: "max-w-none px-4 sm:px-6",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type ContainerProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof containerVariants>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  ),
);

Container.displayName = "Container";

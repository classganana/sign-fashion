import { createElement, type HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading text-balance", {
  variants: {
    level: {
      display: "text-display font-medium",
      title: "text-title font-medium",
      subtitle: "text-subtitle font-normal",
      eyebrow:
        "text-eyebrow text-muted-foreground font-medium uppercase tracking-[0.28em]",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: { level: "title", align: "left" },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingTag;
  };

export function Heading({
  as = "h2",
  className,
  level,
  align,
  ...props
}: HeadingProps) {
  const classes = cn(headingVariants({ level, align }), className);
  switch (as) {
    case "h1":
      return createElement("h1", { ...props, className: classes });
    case "h3":
      return createElement("h3", { ...props, className: classes });
    case "h4":
      return createElement("h4", { ...props, className: classes });
    case "h2":
    default:
      return createElement("h2", { ...props, className: classes });
  }
}

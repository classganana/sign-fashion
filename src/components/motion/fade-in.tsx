"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ReactNode } from "react";

import { fadeDrift, transitions } from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Viewport-triggered drift + fade — subtle, honours reduced-motion */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={fadeDrift.rest}
      whileInView={fadeDrift.enter}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ ...transitions.luxury, delay }}
    >
      {children}
    </motion.div>
  );
}

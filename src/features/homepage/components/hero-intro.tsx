"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Heading } from "@/components/ui/heading";
import { transitions } from "@/lib/motion";

type HeroIntroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

const childEase = transitions.luxury;

export function HeroIntro({ eyebrow, title, subtitle }: HeroIntroProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="max-w-xl space-y-5">
        {eyebrow ?
          <p className="text-eyebrow text-neutral-400">{eyebrow}</p>
        : null}
        <Heading as="h1" level="display" className="text-neutral-50">
          {title}
        </Heading>
        {subtitle ?
          <p className="max-w-lg text-neutral-400 text-[0.9375rem] leading-relaxed md:text-base">
            {subtitle}
          </p>
        : null}
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-xl space-y-5"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: 0.06 },
        },
        hidden: {},
      }}
    >
      {eyebrow ?
        <motion.p
          className="text-eyebrow text-neutral-400"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 14 },
          }}
          transition={childEase}
        >
          {eyebrow}
        </motion.p>
      : null}
      <motion.div
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 },
        }}
        transition={childEase}
      >
        <Heading as="h1" level="display" className="text-neutral-50">
          {title}
        </Heading>
      </motion.div>
      {subtitle ?
        <motion.p
          className="max-w-lg text-neutral-400 text-[0.9375rem] leading-relaxed md:text-base"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 16 },
          }}
          transition={childEase}
        >
          {subtitle}
        </motion.p>
      : null}
    </motion.div>
  );
}

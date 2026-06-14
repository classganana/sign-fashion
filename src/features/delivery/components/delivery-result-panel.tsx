"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Package, Rocket, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

import type { DeliveryAvailabilityResult } from "../types/delivery";

type DeliveryResultPanelProps = {
  result: DeliveryAvailabilityResult;
};

export function DeliveryResultPanel({ result }: DeliveryResultPanelProps) {
  const reduce = useReducedMotion();
  const isExpress = result.available && result.mode === "express";

  const content = isExpress ?
      {
        icon: Rocket,
        badge: "Express",
        title: `Express Delivery Available${result.area ? ` in ${result.area}` : ""}`,
        body: `Order now and receive your order within ${result.estimate.toLowerCase()}.`,
        accent: "border-foreground/15 bg-foreground/[0.03]",
        iconWrap: "border-foreground/20 bg-foreground/[0.06] text-foreground",
      }
    : {
        icon: Truck,
        badge: "Standard",
        title: "Standard Delivery Available",
        body: `Estimated delivery in ${result.estimate}.`,
        accent: "border-border/70 bg-muted/[0.12]",
        iconWrap: "border-border/80 bg-muted/30 text-muted-foreground",
      };

  const Icon = content.icon;

  const panel = (
    <div
      className={cn(
        "space-y-3 rounded-xl border px-5 py-4",
        content.accent,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full border",
            content.iconWrap,
          )}
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 space-y-2 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-6 rounded-full px-2.5 text-[0.62rem] tracking-[0.22em] uppercase">
              {content.badge}
            </Badge>
            {isExpress ?
              <span className="text-[0.72rem]" aria-hidden>
                🚀
              </span>
            : null}
          </div>
          <p className="text-[0.92rem] text-foreground leading-snug tracking-tight">{content.title}</p>
          <p className="text-[0.84rem] text-muted-foreground leading-relaxed">{content.body}</p>
          {result.city ?
            <p className="text-muted-foreground flex items-center gap-1.5 text-[0.72rem] tracking-[0.12em] uppercase">
              <Package className="size-3 shrink-0 opacity-70" strokeWidth={1.5} />
              {result.city} · PIN {result.pincode}
            </p>
          : null}
        </div>
      </div>
    </div>
  );

  if (reduce) {
    return panel;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.luxury}
    >
      {panel}
    </motion.div>
  );
}

type DeliveryStatusMessageProps = {
  message: string;
  tone?: "muted" | "error";
};

export function DeliveryStatusMessage({ message, tone = "muted" }: DeliveryStatusMessageProps) {
  const reduce = useReducedMotion();

  const body = (
    <p
      className={cn(
        "text-[0.84rem] leading-relaxed",
        tone === "error" ? "text-destructive" : "text-muted-foreground",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );

  return (
    <AnimatePresence mode="wait">
      {reduce ?
        body
      : <motion.div
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.micro}
        >
          {body}
        </motion.div>
      }
    </AnimatePresence>
  );
}

"use client";

import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useDeliveryPinCheck } from "../hooks/use-delivery-pin-check";

import { DeliveryResultPanel, DeliveryStatusMessage } from "./delivery-result-panel";

export function DeliveryAvailabilityChecker() {
  const { input, onInputChange, check, result, validationError, phase, hydrated } =
    useDeliveryPinCheck();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    check();
  }

  const showIdleHint = phase === "idle" && !validationError && !result;

  return (
    <section
      className="space-y-5"
      aria-labelledby="delivery-check-heading"
    >
      <div className="space-y-2">
        <p
          id="delivery-check-heading"
          className="text-muted-foreground text-[0.62rem] font-medium tracking-[0.32em] uppercase"
        >
          Check Delivery Availability
        </p>
        <Separator className="bg-border opacity-65" aria-hidden />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-w-0 flex-1">
            <label htmlFor="delivery-pin" className="sr-only">
              PIN code
            </label>
            <Input
              id="delivery-pin"
              name="pincode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Enter PIN code"
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ?
                  "delivery-pin-error"
                : showIdleHint ?
                  "delivery-pin-hint"
                : result ?
                  "delivery-pin-result"
                : undefined
              }
              className={cn(
                "h-12 rounded-full border-border/80 bg-background px-5 text-[0.95rem] tracking-[0.08em]",
                "placeholder:tracking-normal focus-visible:ring-offset-0",
              )}
              maxLength={6}
              disabled={!hydrated}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="min-h-12 shrink-0 touch-manipulation rounded-full px-8 tracking-[0.18em] uppercase"
            disabled={!hydrated}
          >
            Check
          </Button>
        </div>

        {validationError ?
          <div id="delivery-pin-error">
            <DeliveryStatusMessage message={validationError} tone="error" />
          </div>
        : null}

        {showIdleHint ?
          <div id="delivery-pin-hint">
            <DeliveryStatusMessage message="Enter your PIN code to check delivery availability" />
          </div>
        : null}

        {result ?
          <div id="delivery-pin-result">
            <DeliveryResultPanel result={result} />
          </div>
        : null}
      </form>
    </section>
  );
}

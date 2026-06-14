"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getDeliveryAvailability,
  validatePinCode,
} from "@/features/delivery/services/delivery-service";

import type {
  DeliveryAvailabilityResult,
  DeliveryCheckPhase,
} from "../types/delivery";

import { usePersistedDeliveryPin } from "./use-persisted-delivery-pin";

const VALIDATION_MESSAGE = "Please enter a valid 6-digit PIN code.";

export function useDeliveryPinCheck() {
  const { pin: persistedPin, setPin: persistPin, hydrated } = usePersistedDeliveryPin();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DeliveryAvailabilityResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [phase, setPhase] = useState<DeliveryCheckPhase>("idle");

  useEffect(() => {
    if (!hydrated || !persistedPin) {
      return;
    }

    setInput(persistedPin);
    const validation = validatePinCode(persistedPin);
    if (!validation.valid) {
      return;
    }

    setResult(getDeliveryAvailability(validation.normalized));
    setPhase("checked");
  }, [hydrated, persistedPin]);

  const check = useCallback(() => {
    const validation = validatePinCode(input);
    if (!validation.valid) {
      setValidationError(VALIDATION_MESSAGE);
      setResult(null);
      setPhase("idle");
      return;
    }

    const availability = getDeliveryAvailability(validation.normalized);
    setValidationError(null);
    setResult(availability);
    setPhase("checked");
    persistPin(validation.normalized);
    setInput(validation.normalized);
  }, [input, persistPin]);

  const onInputChange = useCallback((next: string) => {
    const digits = next.replace(/\D/g, "").slice(0, 6);
    setInput(digits);
    if (validationError) {
      setValidationError(null);
    }
  }, [validationError]);

  return {
    input,
    onInputChange,
    check,
    result,
    validationError,
    phase,
    hydrated,
  };
}

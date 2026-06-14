"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sign-fashion-delivery-pin";

export function usePersistedDeliveryPin() {
  const [pin, setPinState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPinState(stored);
      }
    } catch {
      /* storage blocked — continue without persistence */
    }
    setHydrated(true);
  }, []);

  const setPin = useCallback((value: string) => {
    setPinState(value);
    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, value);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore write failures */
    }
  }, []);

  return { pin, setPin, hydrated };
}

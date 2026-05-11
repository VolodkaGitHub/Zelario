"use client";

import { useEffect, useRef } from "react";
import gsap from "./gsap";

type UseGSAPOptions = {
  dependencies?: unknown[];
  scope?: React.RefObject<Element | null>;
  revertOnUpdate?: boolean;
};

/**
 * Minimal useGSAP — runs callback inside gsap.context (same pattern as @gsap/react).
 */
export function useGSAP(
  callback: () => void | (() => void),
  options?: UseGSAPOptions
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const scope = options?.scope?.current ?? undefined;
    const ctx = gsap.context(() => callbackRef.current(), scope);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options?.dependencies ?? []);
}

"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(_options?: unknown) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    setInView(true);
  }, []);
  return { ref, inView };
}

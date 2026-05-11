"use client";

import type { HyperspeedOptions } from "./Hyperspeed.types";

/** Lightweight placeholder — full Three.js effect removed for demo bundle size. */
export const hyperspeedPresets = {
  one: {} as HyperspeedOptions,
  two: {} as HyperspeedOptions,
  three: {} as HyperspeedOptions,
};

export default function Hyperspeed({
  className,
  effectOptions: _effectOptions,
  options: _options,
}: {
  className?: string;
  options?: HyperspeedOptions;
  effectOptions?: HyperspeedOptions;
}) {
        return (
    <div
      className={className}
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.35) 0%, transparent 55%), linear-gradient(180deg, #0a0a12 0%, #12121f 100%)",
        minHeight: "100%",
        width: "100%",
      }}
    />
  );
}

export type { HyperspeedOptions } from "./Hyperspeed.types";

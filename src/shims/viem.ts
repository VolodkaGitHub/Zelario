export function formatUnits(value: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

export function parseEther(value: string): bigint {
  const [whole, frac = ""] = value.split(".");
  const padded = (frac + "000000000000000000").slice(0, 18);
  return BigInt(whole || "0") * 10n ** 18n + BigInt(padded);
}

export function parseAbi(_items: readonly string[]) {
  return [] as const;
}

export function http(_url?: string) {
  return {};
}

export function createPublicClient(_config: unknown) {
  return {
    readContract: async () => "",
  };
}

export type Address = `0x${string}`;

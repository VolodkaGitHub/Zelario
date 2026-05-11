export type WalletChainType = "evm" | "solana";

export type WalletProviderId =
  | "metamask"
  | "rabby"
  | "injected"
  | "phantom"
  | "demo";

export interface PhantomSolanaPublicKey {
  toString: () => string;
}

export interface PhantomSolanaProvider {
  isPhantom?: boolean;
  publicKey?: PhantomSolanaPublicKey | null;
  connect: (options?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: PhantomSolanaPublicKey }>;
  signMessage: (
    message: Uint8Array,
    display: "utf8" | "hex"
  ) => Promise<{ signature: Uint8Array; publicKey?: PhantomSolanaPublicKey }>;
  request?: (args: {
    method: string;
    params?: Record<string, unknown>;
  }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  disconnect?: () => Promise<void>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomSolanaProvider;
    };
    solana?: PhantomSolanaProvider;
  }
}

export {};

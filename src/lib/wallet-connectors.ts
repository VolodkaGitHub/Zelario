import type { WalletChainType, WalletProviderId } from "@/types/wallet";
import type { PhantomSolanaProvider } from "@/types/wallet";

export type WalletConnectionResult = {
  address: string;
  chainType: WalletChainType;
  provider: WalletProviderId;
  message: string;
  signature: string;
};

function buildSignMessage(address: string, chainType: WalletChainType) {
  const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `Sign in to Zelario\n\nAddress: ${address}\nChain: ${chainType}\nNonce: ${nonce}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function resolvePublicKeyString(
  provider: PhantomSolanaProvider,
  connectResult?: { publicKey?: { toString: () => string } }
): string {
  const key = connectResult?.publicKey ?? provider.publicKey;
  if (!key) {
    throw new Error("Phantom did not return a Solana account. Unlock Phantom and try again.");
  }
  return typeof key.toString === "function" ? key.toString() : String(key);
}

/** Phantom exposes `window.phantom.solana` and often `window.solana`. */
export function getPhantomSolana(): PhantomSolanaProvider | undefined {
  if (typeof window === "undefined") return undefined;
  const provider =
    window.phantom?.solana ??
    (window as Window & { solana?: PhantomSolanaProvider }).solana;
  if (provider?.isPhantom) return provider;
  return undefined;
}

async function signEvmMessage(address: string, message: string): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Ethereum wallet available to sign the login message.");
  }
  const sig = await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
  return String(sig);
}

async function signSolanaMessage(
  solana: PhantomSolanaProvider,
  message: string
): Promise<string> {
  const encoded = new TextEncoder().encode(message);

  const readSignature = (result: unknown): Uint8Array => {
    if (!result || typeof result !== "object") {
      throw new Error("Phantom did not return a signature.");
    }
    const sig = (result as { signature?: Uint8Array }).signature;
    if (sig instanceof Uint8Array) return sig;
    if (Array.isArray(sig)) return new Uint8Array(sig);
    throw new Error("Phantom returned an invalid signature format.");
  };

  try {
    const result = await solana.signMessage(encoded, "utf8");
    return bytesToBase64(readSignature(result));
  } catch (firstError) {
    if (typeof solana.request !== "function") {
      throw firstError instanceof Error
        ? firstError
        : new Error("Phantom message signing failed.");
    }
    try {
      const result = await solana.request({
        method: "signMessage",
        params: { message: encoded, display: "utf8" },
      });
      return bytesToBase64(readSignature(result));
    } catch {
      throw firstError instanceof Error
        ? firstError
        : new Error("Phantom message signing failed.");
    }
  }
}

export function getDetectedWallets(): WalletProviderId[] {
  if (typeof window === "undefined") return [];

  const found: WalletProviderId[] = [];
  if (window.ethereum?.isMetaMask) found.push("metamask");
  if (window.ethereum?.isRabby) found.push("rabby");
  if (window.ethereum && !found.includes("metamask") && !found.includes("rabby")) {
    found.push("injected");
  }
  if (getPhantomSolana()) found.push("phantom");
  return found;
}

export async function connectWalletProvider(
  provider: WalletProviderId
): Promise<WalletConnectionResult> {
  if (provider === "demo") {
    throw new Error(
      "Demo wallet is disabled. Install MetaMask, Rabby, or Phantom to sign in."
    );
  }

  if (provider === "phantom") {
    const solana = getPhantomSolana();
    if (!solana) {
      throw new Error("Phantom wallet is not installed");
    }

    let connectResult: { publicKey?: { toString: () => string } } | undefined;
    try {
      connectResult = await solana.connect();
    } catch (err) {
      const code = (err as { code?: number })?.code;
      if (code === 4001) {
        throw new Error("Phantom connection was rejected.");
      }
      throw err instanceof Error ? err : new Error("Failed to connect Phantom.");
    }

    const address = resolvePublicKeyString(solana, connectResult);
    const message = buildSignMessage(address, "solana");
    const signature = await signSolanaMessage(solana, message);

    return {
      address,
      chainType: "solana",
      provider: "phantom",
      message,
      signature,
    };
  }

  if (!window.ethereum) {
    throw new Error(
      "No Ethereum wallet detected. Install MetaMask, Rabby, or another Web3 wallet."
    );
  }

  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  const address = accounts[0];
  if (!address) throw new Error("No account returned from wallet");

  const message = buildSignMessage(address, "evm");
  const signature = await signEvmMessage(address, message);

  let resolved: WalletProviderId = "injected";
  if (window.ethereum.isMetaMask) resolved = "metamask";
  else if (window.ethereum.isRabby) resolved = "rabby";

  return {
    address,
    chainType: "evm",
    provider: resolved,
    message,
    signature,
  };
}

export function walletInstallUrl(provider: WalletProviderId): string {
  switch (provider) {
    case "metamask":
      return "https://metamask.io/download/";
    case "rabby":
      return "https://rabby.io/";
    case "phantom":
      return "https://phantom.app/download";
    default:
      return "https://ethereum.org/en/wallets/";
  }
}

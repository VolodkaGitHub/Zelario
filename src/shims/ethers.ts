const WEI = 10n ** 18n;

export function parseEther(value: string): bigint {
  const [whole, frac = ""] = value.split(".");
  const padded = (frac + "000000000000000000").slice(0, 18);
  return BigInt(whole || "0") * WEI + BigInt(padded);
}

export function formatEther(value: bigint): string {
  const whole = value / WEI;
  const frac = value % WEI;
  const fracStr = frac.toString().padStart(18, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

export function parseUnits(value: string, decimals = 18): bigint {
  const [whole, frac = ""] = value.split(".");
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(padded || "0");
}

export function formatUnits(value: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

const DEMO_ETH_RESERVE = parseEther("100");
const DEMO_TOKEN_RESERVE = parseEther("500000");

/** Demo JSON-RPC provider — balances, network, contract reads for DEX UI. */
export class JsonRpcProvider {
  async getBalance(_address: string): Promise<bigint> {
    return parseEther("1.25");
  }

  async getCode(_address: string): Promise<string> {
    return "0x6000";
  }

  async getNetwork(): Promise<{ chainId: bigint; name: string }> {
    return { chainId: 11155111n, name: "sepolia" };
  }
}

export class BrowserProvider extends JsonRpcProvider {
  constructor(_ethereum?: unknown) {
    super();
  }

  async getSigner() {
    return new JsonRpcSigner();
  }
}

export class JsonRpcSigner {
  address = "0xDemo0000000000000000000000000000000001";

  async getAddress() {
    return this.address;
  }
}

type Tx = { wait: () => Promise<{ hash: string }> };

export class Contract {
  constructor(
    _address: string,
    _abi: unknown,
    _runner?: unknown
  ) {
    return new Proxy(this, {
      get: (target, prop: string) => {
        if (prop in target) {
          return (target as Record<string, unknown>)[prop];
        }
        return async (..._args: unknown[]): Promise<Tx> => ({
          wait: async () => ({ hash: `0xdemo${Date.now()}` }),
        });
      },
    });
  }

  async balanceOf(_address: string): Promise<bigint> {
    return parseEther("1000");
  }

  async pools(_token: string) {
    return {
      ethReserve: DEMO_ETH_RESERVE,
      tokenReserve: DEMO_TOKEN_RESERVE,
      totalLiquidity: parseEther("10000"),
    };
  }

  async tokenPool() {
    return {
      coinAReserve: parseEther("250000"),
      coinBReserve: parseEther("250000"),
      totalLiquidity: parseEther("50000"),
    };
  }

  async getUserLiquidity(_token: string): Promise<bigint> {
    return parseEther("100");
  }

  async getTokenPoolUserLiquidity(): Promise<bigint> {
    return parseEther("50");
  }

  async getAmountOut(
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ): Promise<bigint> {
    if (reserveIn === 0n) return 0n;
    return (amountIn * reserveOut) / (reserveIn + amountIn);
  }

  async getListPrice() {
    return parseEther("0.000001");
  }

  async getMinPrice() {
    return parseEther("0.000001");
  }

  async getAllNFTs() {
    const { getDemoRawTokens } = await import("@/mock/demo-nft");
    return getDemoRawTokens();
  }

  async getMyNFTs() {
    const { getDemoRawTokens } = await import("@/mock/demo-nft");
    return getDemoRawTokens().filter((t) =>
      t.owner.toLowerCase().includes("demo")
    );
  }

  async getListedTokenForId(tokenId: bigint) {
    const { getDemoRawTokens } = await import("@/mock/demo-nft");
    const found = getDemoRawTokens().find((t) => t.tokenId === tokenId);
    return (
      found ?? {
        tokenId: 0n,
        owner: "0x0",
        seller: "0x0",
        creator: "0x0",
        price: 0n,
        currentlyListed: false,
        createdAt: 0n,
      }
    );
  }

  async getCompanyStats() {
    return [3n, 1n, 2n] as [bigint, bigint, bigint];
  }

  async tokenURI(tokenId: bigint) {
    const { getDemoMetadataUri } = await import("@/mock/demo-nft");
    return getDemoMetadataUri(tokenId);
  }

  async createToken(_uri: string, _price: bigint, _opts?: { value: bigint }) {
    return { wait: async () => ({ hash: "0xdemo" + Date.now() }) };
  }

  async executeSale(_tokenId: bigint, _opts?: { value: bigint }) {
    return { wait: async () => ({ hash: "0xdemo" + Date.now() }) };
  }

  async relistToken(_tokenId: bigint, _price: bigint, _opts?: { value: bigint }) {
    return { wait: async () => ({ hash: "0xdemo" + Date.now() }) };
  }

  async cancelListing(_tokenId: bigint) {
    return { wait: async () => ({ hash: "0xdemo" + Date.now() }) };
  }

  async claimFee() {
    return parseEther("0.001");
  }

  async claim(_opts?: { value: bigint }) {
    return { wait: async () => ({ hash: "0xdemo" + Date.now() }) };
  }

  async claimTokens(..._args: unknown[]): Promise<Tx> {
    return { wait: async () => ({ hash: `0xdemo${Date.now()}` }) };
  }

  async allowance(..._args: unknown[]): Promise<bigint> {
    return 10n ** 30n;
  }

  async approve(..._args: unknown[]): Promise<Tx> {
    return { wait: async () => ({ hash: `0xdemo${Date.now()}` }) };
  }

  async addTokenLiquidity(..._args: unknown[]): Promise<Tx> {
    return { wait: async () => ({ hash: `0xdemo${Date.now()}` }) };
  }

  async addLiquidity(..._args: unknown[]): Promise<Tx> {
    return { wait: async () => ({ hash: `0xdemo${Date.now()}` }) };
  }
}

export const ethers = {
  parseEther,
  parseUnits,
  formatEther,
  formatUnits,
  BrowserProvider,
  JsonRpcProvider,
  Contract,
};

export default ethers;

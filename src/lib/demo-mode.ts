/** Demo mode: mock API (no backend required). User login requires a real wallet extension. */
export const isDemoMode = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const DEMO_USER_EMAIL = "demo@zelario.demo";
export const DEMO_USER_PASSWORD = "demo123";
export const DEMO_WALLET_ADDRESS =
  "0xDemo0000000000000000000000000000000001";

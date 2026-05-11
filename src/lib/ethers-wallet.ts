import { JsonRpcSigner } from "ethers";

/** Demo signer — no browser extension required. */
export async function getBrowserSigner(): Promise<JsonRpcSigner> {
  return new JsonRpcSigner();
}

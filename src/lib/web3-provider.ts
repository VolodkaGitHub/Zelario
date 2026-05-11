import { JsonRpcProvider } from "ethers";

let staticProvider = new JsonRpcProvider();

export const getStaticProvider = () => staticProvider;

export const refreshStaticProvider = () => {
  staticProvider = new JsonRpcProvider();
  return staticProvider;
};

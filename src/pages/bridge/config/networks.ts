import { ADDRESSES } from "global/config/addresses";
import {
  gravityTokenBase,
  mainnetGravityTokensBase,
} from "./gravityBridgeTokens";

//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Ethereum Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: ADDRESSES.ETHMainnet,
  gravityTokens: mainnetGravityTokensBase,
  rpcUrl: import.meta.env.VITE_MAINNET_RPC,
  isTestChain: false,
  blockExplorerUrl: "https://www.nothing.com",
};

export const GravityTestnet = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  addresses: ADDRESSES.gravityBridgeTest,
  gravityTokens: gravityTokenBase,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};

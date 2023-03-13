import { ADDRESSES } from "global/config/addresses";
import {
  ETH_GRAVITY_BRIDGE_IN_TOKENS,
  TEST_GRAVITY_TOKENS,
} from "./bridgingTokens";

//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Ethereum Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: ADDRESSES.ETHMainnet,
  gravityTokens: ETH_GRAVITY_BRIDGE_IN_TOKENS,
  rpcUrl: "import.meta.env.VITE_MAINNET_RPC",
  isTestChain: false,
  blockExplorerUrl: "https://www.nothing.com",
};

export const GravityTestnet = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  addresses: ADDRESSES.gravityBridgeTest,
  gravityTokens: TEST_GRAVITY_TOKENS,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};

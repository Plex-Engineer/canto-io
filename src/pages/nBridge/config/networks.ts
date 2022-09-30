import {
  gravityTokenBase,
  mainnetGravityTokensBase,
} from "./gravityBridgeTokens";
import { ADDRESSES } from "cantoui";

//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Ethereum Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: ADDRESSES.ETHMainnet,
  gravityTokens: mainnetGravityTokensBase,
  rpcUrl: "https://mainnet.infura.io/v3/c8780df9d5d946f09cba46808ad33561",
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

//convert coin constants
export const fee = {
  amount: "300000000000000000",
  denom: "acanto",
  gas: "3000000",
};
export const chain = {
  chainId: 7700,
  cosmosChainId: "canto_7700-1",
};
export const memo = "";

export interface Fee {
  amount: string;
  denom: string;
  gas: string;
}

export interface Sender {
  accountAddress: string;
  sequence: number;
  accountNumber: number;
  pubkey: string;
}

export interface Chain {
  chainId: number;
  cosmosChainId: string;
}

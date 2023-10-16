import {
  Chain,
  FantomTestnet as FantomTest,
  Mainnet,
  Mumbai,
  Goerli,
  AvalancheTestnet as AvaxTest,
  OptimismGoerli,
} from "@usedapp/core";
import { CORE_ADDRESSES } from "./addresses";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";

//CONSTANTS
const cantoBlockExplorerUrl = "https://tuber.build";
const cantoTestBlockExplorerUrl = "https://testnet.tuber.build";
const emptyBlockExplorerLink = "https://www.nothing.com";

const getAddressLink = (explorerUrl: string) => (address: string) =>
  `${explorerUrl}/address/${address}`;
const getTransactionLink = (explorerUrl: string) => (txnId: string) =>
  `${explorerUrl}/tx/${txnId}`;

//INTERFACES
export interface Network extends Chain {
  name: string;
  icon: string;
}

export interface CantoNetwork extends Network {
  coreContracts: {
    Router: string;
    Comptroller: string;
    Reservoir: string;
    WCANTO: string;
    PriceOracle: string;
  };
  cosmosBlockExplorerUrl: string;
  cosmosAPIEndpoint: string;
  cosmosChainId: string;
}
//only used for bridging. Only bridge supported networks will be labeled as ETHBridgeNetwork
export interface ETHBridgeNetwork extends Network {
  coreContracts: {
    GravityBridge: string;
    WETH: string;
  };
}

/**
 * CHAINS
 */

//MAIN CHAINS
export const CantoMainnet: CantoNetwork = {
  name: "Canto",
  chainName: "Canto",
  nativeCurrency: {
    name: "Canto",
    symbol: "CANTO",
    decimals: 18,
  },
  icon: cantoIcon,
  chainId: 7700,
  rpcUrl: "https://mainnode.plexnode.org:8545",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6",
  multicall2Address: "0x637490E68AA50Ea810688a52D7464E10c25A77c1",
  blockExplorerUrl: cantoBlockExplorerUrl,
  getExplorerAddressLink: getAddressLink(cantoBlockExplorerUrl),
  getExplorerTransactionLink: getTransactionLink(cantoBlockExplorerUrl),
  //canto specific
  coreContracts: CORE_ADDRESSES.CantoMainnet,
  cosmosBlockExplorerUrl: "https://www.mintscan.io/canto",
  cosmosAPIEndpoint: "https://mainnode.plexnode.org:1317",
  cosmosChainId: "canto_7700-1",
};
export const ETHMainnet: ETHBridgeNetwork = {
  ...Mainnet,
  name: "Ethereum",
  icon: ethIcon,
  coreContracts: CORE_ADDRESSES.ETHMainnet,
  rpcUrl: import.meta.env.VITE_MAINNET_RPC,
};

//TEST CHAINS
export const CantoTestnet: CantoNetwork = {
  name: "Canto Testnet",
  chainName: "Canto Testnet",
  nativeCurrency: {
    name: "Canto",
    symbol: "CANTO",
    decimals: 18,
  },
  icon: cantoIcon,
  chainId: 7701,
  rpcUrl: "https://canto-testnet.plexnode.wtf",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0xe536cF7B00069894da25faC787d7aD9D211a2C1A",
  multicall2Address: "0x0e356B86FA2aE1bEB93174C18AD373207a40F2A3",
  blockExplorerUrl: cantoTestBlockExplorerUrl,
  getExplorerAddressLink: getAddressLink(cantoTestBlockExplorerUrl),
  getExplorerTransactionLink: getTransactionLink(cantoTestBlockExplorerUrl),
  //canto specific
  coreContracts: CORE_ADDRESSES.CantoTestnet,
  cosmosBlockExplorerUrl: emptyBlockExplorerLink,
  cosmosAPIEndpoint: "https://api-testnet.plexnode.wtf",
  cosmosChainId: "canto_7701-1",
};
export const GravityTestnet: ETHBridgeNetwork = {
  ...Mainnet,
  name: "Gravity Bridge Testnet",
  chainId: 15,
  coreContracts: CORE_ADDRESSES.gravityBridgeTest,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: emptyBlockExplorerLink,
  icon: bridgeIcon,
};
export const MumbaiTestnet: Network = {
  ...Mumbai,
  name: "Mumbai Testnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/polygon/images/matic-purple.svg",
};
export const FantomTestnet: Network = {
  ...FantomTest,
  name: "Fantom Testnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/fantom/images/ftm.svg",
};

export const GoerliTestnet: Network = {
  ...Goerli,
  name: "Goerli Testnet",
  icon: ethIcon,
  rpcUrl: "https://rpc.ankr.com/eth_goerli",
};

export const AvalancheTestnet: Network = {
  ...AvaxTest,
  name: "Avalanche Testnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/avalanche/images/avax.svg",
};

export const OptimismTestnet: Network = {
  ...OptimismGoerli,
  name: "Optimism Testnet",
  icon: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Profile-Logo.svg",
};

/**
 * EXPORT LISTS
 */

//Will include all canto + testnets
export const ALL_SUPPORTED_CANTO_NETWORKS = [CantoMainnet, CantoTestnet];
//For bridging eth networks + testnests
export const ALL_SUPPORTED_ETH_NETWORKS = [ETHMainnet, GravityTestnet];
//For all network queries (chainId, rpc, blockexplorer, etc.)
export const ALL_SUPPORTED_NETWORKS = [
  CantoMainnet,
  CantoTestnet,
  ETHMainnet,
  MumbaiTestnet,
  FantomTestnet,
  GoerliTestnet,
  AvalancheTestnet,
  OptimismTestnet,
];

/**
 * HELPER TO FIND OUT IF USER IS ON TESTNET
 */
export function onTestnet(chainId?: number): boolean {
  return (
    ALL_SUPPORTED_NETWORKS.find((network) => network.chainId === chainId)
      ?.isTestChain ?? false
  );
}

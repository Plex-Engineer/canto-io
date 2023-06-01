import { CORE_ADDRESSES } from "./addresses";
import { Token } from "./interfaces/tokens";
import { TOKENS } from "./tokenInfo";
import ethIcon from "assets/icons/ETH.svg";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import cantoIcon from "assets/icons/canto-evm.svg";

interface Network {
  name: string;
  symbol: string;
  chainId: number;
  tokens: { [key: string]: Token };
  rpcUrl: string;
  isTestChain: boolean;
  blockExplorerUrl: string;
  icon: string;
}
export interface CantoNetwork extends Network {
  coreContracts: {
    Router: string;
    Comptroller: string;
    Reservoir: string;
    WCANTO: string;
  };
  cosmosBlockExplorerUrl: string;
  cosmosAPIEndpoint: string;
  cosmosChainId: string;
  multicall1Address: string;
  multicall2Address: string;
}
export interface ETHNetwork extends Network {
  coreContracts: {
    GravityBridge: string;
    WETH: string;
  };
}
const emptyBlockExplorerLink = "https://www.nothing.com";
export const CantoMainnet: CantoNetwork = {
  name: "Canto",
  symbol: "CANTO",
  chainId: 7700,
  coreContracts: CORE_ADDRESSES.CantoMainnet,
  tokens: TOKENS.cantoMainnet,
  rpcUrl: "https://mainnode.plexnode.org:8545",
  cosmosAPIEndpoint: "https://mainnode.plexnode.org:1317",
  cosmosChainId: "canto_7700-1",
  isTestChain: false,
  blockExplorerUrl: "https://tuber.build",
  cosmosBlockExplorerUrl: "https://www.mintscan.io/canto",
  multicall1Address: "0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6",
  multicall2Address: "0x637490E68AA50Ea810688a52D7464E10c25A77c1",
  icon: cantoIcon,
};

export const CantoTestnet: CantoNetwork = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId: 7701,
  coreContracts: CORE_ADDRESSES.CantoTestnet,
  tokens: TOKENS.cantoTestnet,
  rpcUrl: "https://canto-testnet.plexnode.wtf",
  cosmosAPIEndpoint: "https://api-testnet.plexnode.wtf",
  cosmosChainId: "canto_7701-1",
  isTestChain: true,
  blockExplorerUrl: "https://testnet.tuber.build",
  cosmosBlockExplorerUrl: emptyBlockExplorerLink,
  multicall1Address: "0xe536cF7B00069894da25faC787d7aD9D211a2C1A",
  multicall2Address: "0x0e356B86FA2aE1bEB93174C18AD373207a40F2A3",
  icon: cantoIcon,
};

//Gravity Bridge Chains
export const ETHMainnet: ETHNetwork = {
  name: "Ethereum",
  symbol: "ETH",
  chainId: 1,
  coreContracts: CORE_ADDRESSES.ETHMainnet,
  tokens: TOKENS.ETHMainnet,
  rpcUrl: import.meta.env.VITE_MAINNET_RPC,
  isTestChain: false,
  blockExplorerUrl: "https://etherscan.io",
  icon: ethIcon,
};

export const GravityTestnet: ETHNetwork = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  coreContracts: CORE_ADDRESSES.gravityBridgeTest,
  tokens: TOKENS.GravityBridge,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: emptyBlockExplorerLink,
  icon: bridgeIcon,
};

//Will include all canto + testnets
export const ALL_SUPPORTED_CANTO_NETWORKS = [CantoMainnet, CantoTestnet];
//For bridging eth networks + testnests
export const ALL_SUPPORTED_ETH_NETWORKS = [ETHMainnet, GravityTestnet];
//For all network queries (chainId, rpc, blockexplorer, etc.)
export const ALL_SUPPORTED_NETWORKS = [
  CantoMainnet,
  CantoTestnet,
  ETHMainnet,
  GravityTestnet,
];
export const onTestnet = (chainId: number) =>
  ALL_SUPPORTED_NETWORKS.find((network) => network.chainId === chainId)
    ?.isTestChain ?? false;

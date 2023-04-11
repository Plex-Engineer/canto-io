import { ADDRESSES } from "./addresses";

const emptyBlockExplorerLink = "https://www.nothing.com";
export const CantoMainnet = {
  name: "Canto Mainnet",
  symbol: "CANTO",
  chainId: 7700,
  addresses: ADDRESSES.cantoMainnet,
  rpcUrl: "https://mainnode.plexnode.org:8545",
  cosmosAPIEndpoint: "https://mainnode.plexnode.org:1317",
  isTestChain: false,
  blockExplorerUrl: "https://evm.explorer.canto.io/",
  multicall1Address: "0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6",
  multicall2Address: "0x637490E68AA50Ea810688a52D7464E10c25A77c1",
};

export const CantoTestnet = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId: 7701,
  addresses: ADDRESSES.testnet,
  rpcUrl: "https://canto-testnet.plexnode.wtf",
  cosmosAPIEndpoint: "https://api-testnet.plexnode.wtf",
  isTestChain: true,
  blockExplorerUrl: emptyBlockExplorerLink,
  multicall1Address: "0xe536cF7B00069894da25faC787d7aD9D211a2C1A",
  multicall2Address: "0x0e356B86FA2aE1bEB93174C18AD373207a40F2A3",
};

//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Ethereum Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: ADDRESSES.ETHMainnet,
  rpcUrl: import.meta.env.VITE_MAINNET_RPC,
  isTestChain: false,
  blockExplorerUrl: emptyBlockExplorerLink,
};

export const GravityTestnet = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  addresses: ADDRESSES.gravityBridgeTest,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: emptyBlockExplorerLink,
};

export const NodeAddresses = {
  CantoMainnet: {
    ChandraRPC: "https://canto.evm.chandrastation.com",
    Plex: {
      rpcUrl: "https://mainnode.plexnode.org:8545",
      cosmosApi: "https://mainnode.plexnode.org:1317",
    },
  },
};

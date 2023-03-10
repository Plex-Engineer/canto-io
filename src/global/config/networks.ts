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
};

export const CantoTestnet = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId: 740,
  addresses: ADDRESSES.testnet,
  rpcUrl: "https://eth.plexnode.wtf",
  cosmosAPIEndpoint: "https://chain.plexnode.wtf",
  isTestChain: true,
  blockExplorerUrl: emptyBlockExplorerLink,
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

import { ADDRESSES } from "./addresses";

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
  blockExplorerUrl: "https://www.nothing.com",
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

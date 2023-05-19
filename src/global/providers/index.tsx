import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import { Chain } from "@usedapp/core";
import { HelmetProvider } from "react-helmet-async";
import { MetamaskConnector } from "@usedapp/core";

import {
  CantoMainnet as CantoMain,
  CantoTestnet as CantoTest,
  ETHMainnet,
} from "global/config/networks";

interface IProviderProps {
  children: React.ReactNode;
}

const getAddressLink = (explorerUrl: string) => (address: string) =>
  `${explorerUrl}/address/${address}`;

const getTransactionLink = (explorerUrl: string) => (txnId: string) =>
  `${explorerUrl}/tx/${txnId}`;

export const CantoMainnet: Chain = {
  chainId: CantoMain.chainId,
  chainName: CantoMain.name,
  rpcUrl: CantoMain.rpcUrl,
  isTestChain: CantoMain.isTestChain,
  isLocalChain: false,
  multicallAddress: CantoMain.multicall1Address,
  multicall2Address: CantoMain.multicall2Address,
  blockExplorerUrl: CantoMain.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
};
export const CantoTestnet: Chain = {
  chainId: CantoTest.chainId,
  chainName: CantoTest.name,
  rpcUrl: CantoTest.rpcUrl,
  isTestChain: CantoTest.isTestChain,
  isLocalChain: false,
  multicallAddress: CantoTest.multicall1Address,
  multicall2Address: CantoTest.multicall2Address,
  blockExplorerUrl: CantoTest.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
};

const config: Config = {
  networks: [ETHMain, CantoMainnet, CantoTestnet],
  readOnlyUrls: {
    [ETHMain.chainId]: ETHMainnet.rpcUrl,
    [CantoMainnet.chainId]: CantoMain.rpcUrl,
    [CantoTestnet.chainId]: CantoTest.rpcUrl,
  },
  connectors: {
    metamask: new MetamaskConnector(),
    // coinbase: new CoinbaseWalletConnector(),
  },
  autoConnect: true,
  fastMulticallEncoding: true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    <HelmetProvider>
      <DAppProvider config={config}>{children}</DAppProvider>
    </HelmetProvider>
  );
};

export default Provider;

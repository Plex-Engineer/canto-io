import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import { Chain } from "@usedapp/core";
import { ETHMainnet } from "pages/bridge/config/networks";
import { HelmetProvider } from "react-helmet-async";
import { MetamaskConnector } from "@usedapp/core";
import { SafeConnector } from "global/utils/safeConnector/safeConnector";
import {
  CantoMainnet as CantoMain,
  CantoTestnet as CantoTest,
} from "global/config/networks";

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) =>
  `${explorerUrl}/address/${address}`;

export const getTransactionLink = (explorerUrl: string) => (txnId: string) =>
  `${explorerUrl}/tx/${txnId}`;

export const CantoMainnet: Chain = {
  chainId: CantoMain.chainId,
  chainName: CantoMain.name,
  rpcUrl: CantoMain.rpcUrl,
  isTestChain: CantoMain.isTestChain,
  isLocalChain: false,
  multicallAddress: "0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6",
  multicall2Address: "0x637490E68AA50Ea810688a52D7464E10c25A77c1",
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
  multicallAddress: "0x121817438FC9b31ed4D6C4ED22eCde15af261f75",
  multicall2Address: "0xd546F2aaB14eA4d4Dc083795b3e94D0C471A272f",
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
    safe: new SafeConnector(),
    metamask: new MetamaskConnector(),
    // coinbase: new CoinbaseWalletConnector(),
  },
  autoConnect: false,
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

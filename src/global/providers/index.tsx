import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import TransactionStatusProvider from "../../providers/transactionContext";
import { Chain } from "@usedapp/core";
import { ETHMainnet } from "pages/bridge/config/networks";
import { CantoMainnet as CantoMain, CantoTestnet as CantoTest } from "cantoui";
import TokenProvider from "pages/lending/providers/activeTokenContext";

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) =>
  `${explorerUrl}/address/${address}`;

export const getTransactionLink = (explorerUrl: string) => (txnId: string) =>
  `${explorerUrl}/tx/${txnId}`;

// export const Gravity: Chain = {
//   chainId: GravityTestnet.chainId,
//   chainName: GravityTestnet.name,
//   isTestChain: GravityTestnet.isTestChain,
//   isLocalChain: false,
//   multicallAddress: "0x86C885e7D824F0278323f7CF4529d330BEA6f87C",
//   multicall2Address: "0xaC14870809392C5181c9869046619b2A86386C80",
//   blockExplorerUrl: GravityTestnet.blockExplorerUrl,
//   getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
//   getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
//   rpcUrl: GravityTestnet.rpcUrl,
// };
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
  noMetamaskDeactivate: true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    <DAppProvider config={config}>
      <TokenProvider>
        <TransactionStatusProvider>{children}</TransactionStatusProvider>
      </TokenProvider>
    </DAppProvider>
  );
};

export default Provider;

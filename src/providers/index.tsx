import { HelmetProvider } from "react-helmet-async";
import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import TransactionStatusProvider from "./transactionContext";
import { Chain } from "@usedapp/core";
import {ETHMainnet, GravityTestnet} from "config/networks"
import {CantoMainnet as CantoMain} from "cantoui"

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) => `${explorerUrl}/address/${address}`

export const getTransactionLink = (explorerUrl: string) => (txnId: string) => `${explorerUrl}/tx/${txnId}`


export const Gravity: Chain = {
  chainId: GravityTestnet.chainId,
  chainName: GravityTestnet.name,
  isTestChain: GravityTestnet.isTestChain,
  isLocalChain: false,
  multicallAddress: '0x86C885e7D824F0278323f7CF4529d330BEA6f87C',
  multicall2Address: '0xaC14870809392C5181c9869046619b2A86386C80',
  blockExplorerUrl: GravityTestnet.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
  rpcUrl: GravityTestnet.rpcUrl
}
export const CantoMainnet: Chain = {
  chainId: CantoMain.chainId,
  chainName: CantoMain.name,
  rpcUrl : CantoMain.rpcUrl,
  isTestChain: CantoMain.isTestChain,
  isLocalChain: false,
  multicallAddress: '0x210b88d5Ad4BEbc8FAC4383cC7F84Cd4F03d18c6',
  multicall2Address: '0x637490E68AA50Ea810688a52D7464E10c25A77c1',
  blockExplorerUrl: CantoMain.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
}




const config: Config = {
  networks: [Gravity, ETHMain, CantoMainnet],
  readOnlyUrls: {
    [Gravity.chainId]: GravityTestnet.rpcUrl,
    [ETHMain.chainId]: ETHMainnet.rpcUrl,
    [CantoMainnet.chainId]: CantoMain.rpcUrl
  },
  noMetamaskDeactivate: true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    <DAppProvider config={config}>
      <HelmetProvider>
        <TransactionStatusProvider>{children}</TransactionStatusProvider>
      </HelmetProvider>
    </DAppProvider>
  );
};

export default Provider;

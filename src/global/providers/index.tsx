import { DAppProvider, Config } from "@usedapp/core";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { MetamaskConnector } from "@usedapp/core";
import { ALL_SUPPORTED_NETWORKS } from "global/config/networks";

interface IProviderProps {
  children: React.ReactNode;
}

const config: Config = {
  networks: ALL_SUPPORTED_NETWORKS,
  readOnlyUrls: Object.fromEntries(
    Object.entries(ALL_SUPPORTED_NETWORKS).map(([, val]) => [
      Number(val.chainId),
      val.rpcUrl ?? "",
    ])
  ),
  connectors: {
    metamask: new MetamaskConnector(),
  },
  autoConnect: true,
  fastMulticallEncoding: true,
  noMetamaskDeactivate: true,
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

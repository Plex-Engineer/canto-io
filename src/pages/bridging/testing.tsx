import { useEffect } from "react";
import useBridgingStore from "./stores/bridgingStore";
import { useNetworkInfo } from "global/stores/networkInfo";
import { PrimaryButton } from "global/packages/src";
import { bridgeTxRouter } from "./utils/transactions";
import { useTransactionStore } from "global/stores/transactionStore";
import { parseUnits } from "ethers/lib/utils";

export const TestingComponent = () => {
  const networkInfo = useNetworkInfo();
  const txStore = useTransactionStore();
  const bridgeStore = useBridgingStore();
  useEffect(() => {
    bridgeStore.chainIdChanged(Number(networkInfo.chainId));
  }, [networkInfo.chainId]);
  return (
    <div>
      <h1>Testing</h1>
      <br />
      <h2>Selected Token: {bridgeStore.selectedToken?.symbol}</h2>
      <h2>From: {bridgeStore.fromNetwork.name}</h2>
      <h2>To: {bridgeStore.toNetwork.name}</h2>
      <br />
      <div style={{ display: "flex", flexDirection: "row", gap: "100px" }}>
        <div>
          {bridgeStore.allNetworks.map((network) => (
            <ul key={network.name}>
              <li>
                {network.name}{" "}
                <button onClick={() => bridgeStore.setNetwork(network, true)}>
                  from
                </button>{" "}
                <button onClick={() => bridgeStore.setNetwork(network, false)}>
                  to
                </button>
              </li>
            </ul>
          ))}
        </div>
        <div>
          {bridgeStore.allTokens.map((token) => (
            <ul key={token.address}>
              <li>
                {token.name}{" "}
                <button onClick={() => bridgeStore.setToken(token)}>
                  select
                </button>
              </li>
              <li>balance: {token.balance?.toString()}</li>
            </ul>
          ))}
        </div>
      </div>
      <PrimaryButton
        onClick={() => {
          bridgeTxRouter(
            txStore,
            networkInfo.account,
            networkInfo.cantoAddress,
            bridgeStore.fromNetwork,
            bridgeStore.toNetwork,
            bridgeStore.selectedToken,
            parseUnits("1")
          );
        }}
      >
        SEND
      </PrimaryButton>
    </div>
  );
};

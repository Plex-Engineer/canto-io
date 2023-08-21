import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import CantoTabs from "global/components/tabs";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./TransactionHistory";
import { useTransactionHistory } from "./hooks/useTransactionHistory";
import { useNetworkInfo } from "global/stores/networkInfo";
import { createConvertTransactions } from "./utils/utils";
import walletIcon from "assets/wallet.svg";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import BalanceTableModal from "./walkthrough/components/modals/BalanceTableModal";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import RecoveryPage from "./Recovery";
import { useTransactionStore } from "global/stores/transactionStore";
import useBridgingStore from "./stores/bridgingStore";
import { CANTO_MAIN_CONVERT_COIN_TOKENS } from "./config/tokens.ts/bridgingTokens";

const Bridging = () => {
  const txStore = useTransactionStore();
  const networkInfo = useNetworkInfo();
  const bridgingHistory = useTransactionHistory();
  const bridgeStore = useBridgingStore();

  const bridgingTokens = useBridgeTokenInfo();
  const { activateBrowserWallet } = useEthers();
  const hasRecoveryToken = bridgingTokens.unkownIBCTokens.length > 0;

  //keep track if we need to swap networks on bridging
  const [tabSelected, setTabSelected] = useState<"in" | "out">("in");

  //chainId change to show testnet networks
  useEffect(() => {
    const setNetworks = setTimeout(
      () =>
        bridgeStore.chainIdChanged(
          Number(networkInfo.chainId),
          tabSelected === "in"
        ),
      1000
    );
    return () => clearTimeout(setNetworks);
  }, [networkInfo.chainId, tabSelected]);

  //get new data every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await bridgeStore.syncTokens();
    }, 6000);
    return () => clearInterval(interval);
  }, [networkInfo.account]);

  useEffect(() => {
    //wait 1 second so user can switch tabs before loading in
    const initTokens = setTimeout(
      async () => await bridgeStore.syncTokens(),
      1000
    );
    return () => clearTimeout(initTokens);
  }, [networkInfo.account, tabSelected]);

  const NotConnectedTabs = () => {
    const tabs = [];
    for (let i = 0; i < 3; i++) {
      tabs.push(
        <NotConnected
          title="Wallet is not connected"
          subtext="to use bridge you need to connect a wallet through metamask"
          buttonText="connnect wallet"
          bgFilled
          onClick={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          icon={walletIcon}
        />
      );
    }
    return tabs;
  };
  return (
    <Styled>
      <div className="floating-buttons">
        <BalanceTableModal
          ethTokens={bridgingTokens.userBridgeInTokens}
          cantoTokens={bridgingTokens.userBridgeOutTokens}
          nativeTokens={bridgingTokens.userNativeTokens}
          allConvertCoinTokens={CANTO_MAIN_CONVERT_COIN_TOKENS}
        />
      </div>

      <CantoTabs
        names={[
          "bridge in",
          "bridge out",
          "tx history",
          ...(hasRecoveryToken ? ["recovery"] : []),
        ]}
        onClicks={[
          () => {
            if (tabSelected !== "in") {
              setTabSelected("in");
              bridgeStore.swapNetworks();
            }
          },
          () => {
            if (tabSelected !== "out") {
              setTabSelected("out");
              bridgeStore.swapNetworks();
            }
          },
        ]}
        panels={
          !networkInfo.account
            ? NotConnectedTabs()
            : [
                <BridgeIn
                  key={"in"}
                  bridgeTokens={bridgeStore.allTokens}
                  selectedToken={bridgeStore.selectedToken}
                  selectToken={bridgeStore.setToken}
                  allNetworks={bridgeStore.allNetworks}
                  fromNetwork={bridgeStore.fromNetwork}
                  toNetwork={bridgeStore.toNetwork}
                  selectNetwork={bridgeStore.setNetwork}
                  ethAddress={networkInfo.account}
                  cantoAddress={networkInfo.cantoAddress}
                  tx={bridgeStore.bridgeTx}
                  step2Transactions={createConvertTransactions(
                    bridgingHistory.pendingBridgeInTransactions,
                    bridgingTokens.userNativeTokens,
                    true,
                    Number(networkInfo.chainId)
                  )}
                  chainId={Number(networkInfo.chainId)}
                  txStore={txStore}
                />,

                <BridgeOut
                  key={"out"}
                  bridgeTokens={bridgeStore.allTokens}
                  selectedToken={bridgeStore.selectedToken}
                  selectToken={bridgeStore.setToken}
                  allNetworks={bridgeStore.allNetworks}
                  fromNetwork={bridgeStore.fromNetwork}
                  toNetwork={bridgeStore.toNetwork}
                  selectNetwork={bridgeStore.setNetwork}
                  ethAddress={networkInfo.account}
                  cantoAddress={networkInfo.cantoAddress}
                  tx={bridgeStore.bridgeTx}
                  chainId={Number(networkInfo.chainId)}
                  txStore={txStore}
                />,
                <Transactions
                  key={"transaction"}
                  allTransactions={bridgingHistory}
                />,
                ...(hasRecoveryToken
                  ? [
                      <RecoveryPage
                        key={"recovery"}
                        tokens={bridgingTokens.unkownIBCTokens}
                        cantoAddress={networkInfo.cantoAddress}
                        txStore={txStore}
                      />,
                    ]
                  : []),
              ]
        }
      />
    </Styled>
  );
};

const Styled = styled.div`
  .diff {
    position: relative;
    top: 4.5rem;
  }

  display: flex;
  justify-content: center;
  align-self: center;
  position: relative;
  max-width: 1200px;
  .walkthrough {
    position: absolute;
    top: 5rem;
    right: 2rem;
    height: 40px;
    width: 40px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: black;
    font-size: 20px;
    z-index: 3;
    cursor: pointer;
    &:hover {
      background-color: #13a068;
    }
  }
  .floating-buttons {
    top: 5rem;
    right: 0rem;
    position: absolute;
    display: flex;
    gap: 2rem;
    width: 5rem;
    height: 50rem;
  }

  @media (max-width: 1000px) {
    .walkthrough {
      right: 5rem;
      top: 1.2rem;
    }
    .floating-buttons {
      top: 4.6rem;
    }
  }
`;

export default Bridging;

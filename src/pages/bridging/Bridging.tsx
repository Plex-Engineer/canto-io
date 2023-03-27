import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import CantoTabs from "global/components/tabs";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./TransactionHistory";
import { useTransactionHistory } from "./hooks/useTransactionHistory";
import { useNetworkInfo } from "global/stores/networkInfo";
import { createConvertTransactions } from "./utils/utils";
import { SelectedTokens } from "./stores/bridgeTokenStore";
import walletIcon from "assets/wallet.svg";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import BalanceTableModal from "./walkthrough/components/modals/BalanceTableModal";
import styled from "@emotion/styled";

const Bridging = () => {
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const bridgingHistory = useTransactionHistory();
  const { activateBrowserWallet } = useEthers();

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
      <div
        className="diff"
        style={{
          position: "relative",
        }}
      >
        <BalanceTableModal
          ethTokens={bridgingTokens.userBridgeInTokens}
          cantoTokens={bridgingTokens.userBridgeOutTokens}
          nativeTokens={bridgingTokens.userNativeTokens}
        />
      </div>
      <CantoTabs
        names={["bridge in", "bridge out", "tx history"]}
        panels={
          !networkInfo.account
            ? NotConnectedTabs()
            : [
                <BridgeIn
                  key={"in"}
                  ethAddress={networkInfo.account}
                  cantoAddress={networkInfo.cantoAddress}
                  ethGBridgeTokens={bridgingTokens.userBridgeInTokens}
                  selectedEthToken={bridgingTokens.selectedTokens.bridgeInToken}
                  selectEthToken={(tokenAddress) =>
                    bridgingTokens.setSelectedToken(
                      tokenAddress,
                      SelectedTokens.ETHTOKEN
                    )
                  }
                  step2Transactions={createConvertTransactions(
                    bridgingHistory.pendingBridgeInTransactions,
                    bridgingTokens.userNativeTokens,
                    true
                  )}
                  needPubKey={!networkInfo.hasPubKey}
                />,
                <BridgeOut
                  key={"out"}
                  ethAddress={networkInfo.account}
                  cantoAddress={networkInfo.cantoAddress}
                  bridgeOutTokens={bridgingTokens.userBridgeOutTokens}
                  selectedBridgeOutToken={
                    bridgingTokens.selectedTokens.bridgeOutToken
                  }
                  selectToken={(tokenAddress) =>
                    bridgingTokens.setSelectedToken(
                      tokenAddress,
                      SelectedTokens.CONVERTOUT
                    )
                  }
                  step2Transactions={createConvertTransactions(
                    [],
                    bridgingTokens.userNativeTokens,
                    false
                  )}
                />,
                <Transactions
                  key={"transaction"}
                  allTransactions={bridgingHistory}
                />,
              ]
        }
      />
    </Styled>
  );
};

const Styled = styled.div``;

export default Bridging;

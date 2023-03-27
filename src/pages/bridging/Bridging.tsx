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
import { useEtherBalance, useEthers } from "@usedapp/core";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import BalanceTableModal from "./walkthrough/components/modals/BalanceTableModal";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { GenPubKeyWalkthrough } from "./walkthrough/components/pages/genPubKey";
import { CantoMainnet } from "global/config/networks";
import { useState } from "react";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";
import { PubKeyStyled } from "./walkthrough/Walkthrough";
import warningRedIcon from "assets/warning_red.svg";
import { parseUnits } from "ethers/lib/utils";

const Bridging = () => {
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const bridgingHistory = useTransactionHistory();
  const { activateBrowserWallet } = useEthers();
  const navigate = useNavigate();
  const [pubKeySuccess, setPubKeySuccess] = useState("None");
  const ethBalance = useEtherBalance(networkInfo.account, { chainId: 1 });
  const canPubKey =
    (ethBalance?.gte(parseUnits("0.01")) ||
      networkInfo.balance?.gte(parseUnits("0.5"))) ??
    false;

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
                networkInfo.hasPubKey ? (
                  <BridgeIn
                    key={"in"}
                    ethAddress={networkInfo.account}
                    cantoAddress={networkInfo.cantoAddress}
                    ethGBridgeTokens={bridgingTokens.userBridgeInTokens}
                    selectedEthToken={
                      bridgingTokens.selectedTokens.bridgeInToken
                    }
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
                  />
                ) : canPubKey ? (
                  <PubKeyStyled>
                    <NotConnected
                      title="Not Qualified to public generate key"
                      subtext="It seems like you don't have a public key on this account. In order to be qualified to generate a public key, you must have at least 0.5 CANTO or 0.01 ETH on mainnet"
                      buttonText="Home"
                      onClick={() => {
                        navigate("/");
                      }}
                      icon={warningRedIcon}
                    />
                  </PubKeyStyled>
                ) : (
                  <GenPubKeyWalkthrough
                    txGenPubKey={() => {
                      if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
                        addNetwork();
                      } else {
                        generatePubKey(networkInfo.account, setPubKeySuccess);
                      }
                    }}
                    txStatus={pubKeySuccess}
                  />
                ),
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

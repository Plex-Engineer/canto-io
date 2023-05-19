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
import Tooltip from "global/packages/src/components/molecules/Tooltip";
import { Text } from "global/packages/src";
import guideImg from "assets/guide.svg";
import RecoveryPage from "./Recovery";

const Bridging = () => {
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const bridgingHistory = useTransactionHistory();
  const { activateBrowserWallet } = useEthers();
  const navigate = useNavigate();
  const [pubKeySuccess, setPubKeySuccess] = useState("None");
  const hasRecoveryToken = bridgingTokens.unkownIBCTokens.length > 0;
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
      <div className="floating-buttons">
        <BalanceTableModal
          ethTokens={bridgingTokens.userBridgeInTokens}
          cantoTokens={bridgingTokens.userBridgeOutTokens}
          nativeTokens={bridgingTokens.userNativeTokens}
        />
        <Tooltip
          position="bottom right"
          trigger={
            <div
              role={"button"}
              tabIndex={-2}
              className="walkthrough"
              onClick={() => {
                navigate("/bridge/walkthrough");
              }}
            >
              <img src={guideImg} height={20} alt="" />
            </div>
          }
          content={<Text size="text4">Click here for a walkthrough.</Text>}
        />
      </div>

      <CantoTabs
        names={[
          "bridge in",
          "bridge out",
          "tx history",
          ...(hasRecoveryToken ? ["recovery"] : []),
        ]}
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
                ) : !canPubKey ? (
                  <PubKeyStyled>
                    <NotConnected
                      title="you don’t have enough Canto or ETH to generate a public key"
                      subtext="In order to generate a public key, you must have at least 0.5 CANTO or 0.01 ETH on mainnet"
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
                        generatePubKey(
                          networkInfo.account,
                          setPubKeySuccess,
                          Number(networkInfo.chainId)
                        );
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
                ...(hasRecoveryToken
                  ? [
                      <RecoveryPage
                        key={"recovery"}
                        tokens={bridgingTokens.unkownIBCTokens}
                        cantoAddress={networkInfo.cantoAddress}
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

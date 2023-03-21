import styled from "@emotion/styled";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import walletIcon from "assets/wallet.svg";
import warningIcon from "assets/warning.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBridgeWalkthroughStore } from "./store/bridgeWalkthroughStore";
import { useCustomWalkthrough } from "./store/customUseWalkthrough";
import { useEthers } from "@usedapp/core";
import { BridgeInStep, BridgeOutStep } from "./config/interfaces";
import { GenPubKeyWalkthrough } from "./components/pages/genPubKey";
import BalanceTableModal from "./components/modals/BalanceTableModal";
import LoadingWalkthrough from "./components/pages/LoadingWalkthrough";
import NoFunds from "./components/pages/noFunds";
import IntroPage from "./components/pages/intro";
import { BridgeInManager } from "./managers/BridgeInManager";
import { BridgeOutManager } from "./managers/BridgeOutManager";

const Walkthrough = () => {
  const walkthrough = useBridgeWalkthroughStore();
  const { active: isConnected, activateBrowserWallet } = useEthers();
  const navigate = useNavigate();
  const { networkInfo, walkthroughInfo, transactions, tokens, userInputs } =
    useCustomWalkthrough();

  const [finishedBridgeSelection, setFinishedBridgeSelection] = useState(false);
  function restartWalkthrough() {
    setFinishedBridgeSelection(false);
    walkthrough.resetState(true);
    walkthrough.resetState(false);
  }

  if (networkInfo.needPubKey) {
    if (!networkInfo.canPubKey) {
      return (
        <Styled>
          <NotConnected
            title="No Public Key"
            subtext="It seems like you don't have a public key on this account. In order to generate a public key, you must have at least 0.5 CANTO or 0.01 ETH on mainnet"
            buttonText="Home"
            onClick={() => {
              navigate("/");
            }}
            icon={warningIcon}
          />
        </Styled>
      );
    }
    return (
      <GenPubKeyWalkthrough
        txGenPubKey={transactions.pubKey.send}
        txStatus={transactions.pubKey.state}
      />
    );
  }

  const hasFunds = walkthroughInfo.canBridgeIn || walkthroughInfo.canBridgeOut;

  if (!isConnected) {
    return (
      <Styled>
        <NotConnected
          buttonText="connect wallet"
          title="Wallet is not connected"
          subtext="to use the bridge guide you need to connect a wallet through metamask"
          icon={walletIcon}
          onClick={activateBrowserWallet}
        />
      </Styled>
    );
  }
  return (
    <Styled>
      <BalanceTableModal
        ethTokens={tokens.allUserTokens.userBridgeInTokens}
        nativeTokens={tokens.allUserTokens.userNativeTokens}
        cantoTokens={tokens.allUserTokens.userBridgeOutTokens}
      />
      <LoadingWalkthrough delay={2500} />
      {!hasFunds && <NoFunds />}
      {!finishedBridgeSelection && hasFunds && (
        <IntroPage
          setBridgeType={walkthrough.setBridgeType}
          currentBridgeType={walkthrough.currentBridgeType}
          canSkip={walkthroughInfo.canSkip}
          currentSkipDecision={walkthrough.userSkip}
          setSkipDecision={walkthrough.setUserSkip}
          onNext={() => {
            if (walkthrough.userSkip) {
              if (walkthrough.currentBridgeType === "IN") {
                walkthrough.setBridgeInStep(BridgeInStep.SWITCH_TO_CANTO);
              } else {
                walkthrough.setBridgeOutStep(BridgeOutStep.SWITCH_TO_CANTO_2);
              }
            }
            setFinishedBridgeSelection(true);
          }}
          canBridgeIn={walkthroughInfo.canBridgeIn}
          canBridgeOut={walkthroughInfo.canBridgeOut}
        />
      )}
      {finishedBridgeSelection &&
        hasFunds &&
        walkthrough.currentBridgeType == "IN" && (
          <BridgeInManager
            networkInfo={networkInfo}
            transactions={{
              approve: transactions.approve,
              sendCosmos: transactions.sendCosmos,
              convertIn: transactions.convertIn,
            }}
            currentStep={walkthrough.bridgeInStep}
            onPrev={() => {
              if (walkthrough.bridgeInStep === 0) {
                setFinishedBridgeSelection(false);
              } else {
                walkthrough.previousStep(true);
              }
            }}
            onNext={() => walkthrough.nextStep(true)}
            canContinue={walkthroughInfo.canContinue}
            canGoBack={walkthroughInfo.canGoBack}
            currentBridgeInToken={tokens.selectedTokens.bridgeInToken}
            bridgeInTokens={tokens.allUserTokens.userBridgeInTokens}
            setToken={tokens.setTokens}
            amount={userInputs.amount}
            setAmount={userInputs.setAmount}
            convertTokens={tokens.allUserTokens.userNativeTokens}
            currentConvertToken={tokens.selectedTokens.convertInToken}
            restartWalkthrough={restartWalkthrough}
          />
        )}

      {finishedBridgeSelection &&
        hasFunds &&
        walkthrough.currentBridgeType == "OUT" && (
          <BridgeOutManager
            networkInfo={networkInfo}
            transactions={{
              convertOut: transactions.convertOut,
              ibcOut: transactions.bridgeOut,
            }}
            userInputs={userInputs}
            currentStep={walkthrough.bridgeOutStep}
            onPrev={() => {
              if (walkthrough.bridgeOutStep === 0) {
                setFinishedBridgeSelection(false);
              } else {
                walkthrough.previousStep(false);
              }
            }}
            onNext={() => walkthrough.nextStep(false)}
            canContinue={walkthroughInfo.canContinue}
            canGoBack={walkthroughInfo.canGoBack}
            convertTokens={tokens.allUserTokens.userBridgeOutTokens}
            currentConvertToken={tokens.selectedTokens.convertOutToken}
            bridgeOutTokens={tokens.allUserTokens.userNativeTokens}
            currentBridgeOutToken={tokens.selectedTokens.bridgeOutToken}
            setToken={tokens.setTokens}
            restartWalkthrough={restartWalkthrough}
          />
        )}
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

export default Walkthrough;

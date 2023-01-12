import styled from "@emotion/styled";
import { useState } from "react";
import { useBridgeWalkthroughStore } from "./store/bridgeWalkthroughStore";
import { BridgeOutManager } from "./managers/BridgeOutManager";
import IntroPage from "./pages/intro";
import { useCustomWalkthrough } from "./store/customUseWalkthrough";
import { BridgeInManager } from "./managers/BridgeInManager";
import { BridgeInStep, BridgeOutStep } from "./walkthroughTracker";
import { GenPubKeyWalkthrough } from "./pages/genPubKey";
import { generatePubKey } from "global/utils/cantoTransactions/publicKey";

const Walkthrough = () => {
  const walkthrough = useBridgeWalkthroughStore();
  const {
    canSkip,
    canContinue,
    canGoBack,
    chainId,
    cantoAddress,
    gravityAddress,
    tokens,
    bridgeInTx,
    bridgeOutNetworks,
    amount,
    setAmount,
    cosmosTxStatus,
    setCosmosTxStatus,
    canBridgeIn,
    canBridgeOut,
    needPubKey,
    pubKey,
  } = useCustomWalkthrough();
  const [finishedBridgeSelection, setFinishedBridgeSelection] = useState(false);
  function restartWalkthrough() {
    setFinishedBridgeSelection(false);
    walkthrough.resetState(true);
    walkthrough.resetState(false);
  }

  if (needPubKey) {
    return (
      <GenPubKeyWalkthrough txGenPubKey={pubKey.tx} txStatus={pubKey.status} />
    );
  }
  return (
    <Styled>
      {!(canBridgeIn || canBridgeOut) ? <div>NO FUNDS TO BRIDGE</div> : null}
      {!finishedBridgeSelection && (
        <IntroPage
          setBridgeType={walkthrough.setBridgeType}
          currentBridgeType={walkthrough.currentBridgeType}
          canSkip={canSkip}
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
        />
      )}
      {finishedBridgeSelection && walkthrough.currentBridgeType == "IN" && (
        <BridgeInManager
          chainId={chainId}
          cantoAddress={cantoAddress}
          currentStep={walkthrough.bridgeInStep}
          onPrev={() => {
            if (walkthrough.bridgeInStep === 0) {
              setFinishedBridgeSelection(false);
            } else {
              walkthrough.previousStep(true);
            }
          }}
          onNext={() => walkthrough.nextStep(true)}
          canContinue={canContinue}
          canGoBack={canGoBack}
          currentBridgeInToken={tokens.selectedTokens.bridgeInToken}
          bridgeInTokens={tokens.allUserTokens.bridgeInTokens}
          setToken={tokens.setTokens}
          amount={amount}
          setAmount={setAmount}
          sendApprove={bridgeInTx.approve.tx}
          stateApprove={bridgeInTx.approve.state}
          gravityAddress={gravityAddress}
          sendCosmos={bridgeInTx.sendCosmos.tx}
          stateCosmos={bridgeInTx.sendCosmos.state}
          convertTokens={tokens.allUserTokens.convertTokens}
          currentConvertToken={tokens.selectedTokens.convertInToken}
          cosmosTxStatus={cosmosTxStatus}
          setCosmosTxStatus={setCosmosTxStatus}
          restartWalkthrough={restartWalkthrough}
        />
      )}

      {finishedBridgeSelection && walkthrough.currentBridgeType == "OUT" && (
        <BridgeOutManager
          chainId={chainId}
          cantoAddress={cantoAddress}
          currentStep={walkthrough.bridgeOutStep}
          onPrev={() => {
            if (walkthrough.bridgeOutStep === 0) {
              setFinishedBridgeSelection(false);
            } else {
              walkthrough.previousStep(false);
            }
          }}
          onNext={() => walkthrough.nextStep(false)}
          canContinue={canContinue}
          canGoBack={canGoBack}
          convertTokens={tokens.allUserTokens.convertTokens}
          currentConvertToken={tokens.selectedTokens.convertOutToken}
          bridgeOutTokens={tokens.allUserTokens.bridgeOutTokens}
          currentBridgeOutToken={tokens.selectedTokens.bridgeOutToken}
          bridgeOutNetworks={bridgeOutNetworks.allNetworks}
          currentBridgeOutNetwork={bridgeOutNetworks.selectedNetwork}
          setBridgeOutNetwork={bridgeOutNetworks.setNetwork}
          setToken={tokens.setTokens}
          amount={amount}
          setAmount={setAmount}
          cosmosTxStatus={cosmosTxStatus}
          setCosmosTxStatus={setCosmosTxStatus}
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

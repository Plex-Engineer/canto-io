import styled from "@emotion/styled";
import { useState } from "react";
import { useBridgeWalkthroughStore } from "./store/bridgeWalkthroughStore";
import { BridgeOutManager } from "./managers/BridgeOutManager";
import IntroPage from "./pages/intro";
import { useCustomWalkthrough } from "./store/customUseWalkthrough";
import { BridgeInManager } from "./managers/BridgeInManager";
import { BridgeInStep, BridgeOutStep } from "./walkthroughTracker";

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
    setCosmosTxStatus,
  } = useCustomWalkthrough();
  const [finishedBridgeSelection, setFinishedBridgeSelection] = useState(false);
  return (
    <Styled>
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
          setCosmosTxStatus={setCosmosTxStatus}
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
          setCosmosTxStatus={setCosmosTxStatus}
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

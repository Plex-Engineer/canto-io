import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { useState } from "react";
import { useBridgeWalkthroughStore } from "./store/bridgeWalkthroughStore";
import { BridgeOutManager } from "./managers/BridgeOutManager";
import IntroPage from "./pages/intro";
import { useCustomWalkthrough } from "./store/customUseWalkthrough";
import BarIndicator from "./components/barIndicator";

const Walkthrough = () => {
  const walkthrough = useBridgeWalkthroughStore();

  const {
    canSkip,
    canContinue,
    chainId,
    selectedTokens,
    allUserTokens,
    setTokens,
    amount,
    setAmount,
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
              //skip here
            }
            setFinishedBridgeSelection(true);
          }}
        />
      )}
      {finishedBridgeSelection && walkthrough.currentBridgeType == "OUT" && (
        <>
          <BridgeOutManager
            chainId={chainId}
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
            convertTokens={allUserTokens.convertTokens}
            currentConvertToken={selectedTokens.convertOutToken}
            bridgeOutTokens={allUserTokens.bridgeOutTokens}
            currentBridgeOutToken={selectedTokens.bridgeOutToken}
            setToken={setTokens}
            amount={amount}
            setAmount={setAmount}
          />
        </>
      )}
      <BarIndicator total={7} current={0} />
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

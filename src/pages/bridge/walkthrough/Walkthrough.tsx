import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import { useBridgeStore } from "../stores/gravityStore";
import AmountPage from "./pages/amount";
import IntroPage from "./pages/intro";
import SelectTokenPage from "./pages/selectToken";
import SwitchNetworkPage from "./pages/switchNetwork";
import { BridgeStep, useBridgeWalkthroughStore } from "./store/useWalkthough";

const Walkthrough = () => {
  const walkthrough = useBridgeWalkthroughStore();
  const bridging = useBridgeStore();
  return (
    <Styled>
      <Text type="title">Walkthrough</Text>

      {walkthrough.currentStep == BridgeStep.CHOICE && <IntroPage />}
      {walkthrough.currentStep == BridgeStep.SWITCH_NETWORK && (
        <SwitchNetworkPage />
      )}
      {walkthrough.currentStep == BridgeStep.CHOOSE_TOKEN && (
        <SelectTokenPage />
      )}
      {walkthrough.currentStep == BridgeStep.CHOOSE_AMOUNT && <AmountPage />}
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export default Walkthrough;

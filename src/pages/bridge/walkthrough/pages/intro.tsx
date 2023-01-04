import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import TextSwitch from "../../walkthrough-dummy/components/TextSwitch";
import { BridgeStep, useBridgeWalkthroughStore } from "../store/useWalkthough";
import BaseStyled from "./layout";

const IntroPage = () => {
  const walkthrough = useBridgeWalkthroughStore();
  return (
    <Styled>
      <Text type="title" size="title2">
        Getting Started
      </Text>
      <Text type="text" size="title3">
        What would you like to do ?
      </Text>
      <div className="row">
        <TextSwitch
          text="get funds into canto"
          active={walkthrough.BridgeType == "IN"}
          onClick={() => {
            walkthrough.setBridgeType("IN");
          }}
        />
        <TextSwitch
          text="get funds out of canto"
          active={walkthrough.BridgeType == "OUT"}
          onClick={() => walkthrough.setBridgeType("OUT")}
        />
      </div>

      <Text type="text" size="title3">
        Has your gravity Bridge transaction completed ?
      </Text>
      <div className="row">
        <TextSwitch
          text="mainnet to gBridge"
          active={walkthrough.BridgeStep == "FIRST"}
          onClick={() => {
            walkthrough.setBridgeStep("FIRST");
          }}
        />
        <TextSwitch
          text="gBridge to canto(EVM)"
          active={walkthrough.BridgeStep == "LAST"}
          onClick={() => walkthrough.setBridgeStep("LAST")}
        />
      </div>

      <div className="row">
        <OutlinedButton disabled>Prev</OutlinedButton>
        <PrimaryButton
          onClick={() => walkthrough.pushStepTracker(BridgeStep.SWITCH_NETWORK)}
          disabled={
            walkthrough.BridgeStep == "NONE" || walkthrough.BridgeType == "NONE"
          }
        >
          Next
        </PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
`;

export default IntroPage;

import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface Props {
  PageNumber: number;
}

const IntroPage = (props: Props) => {
  const [bridgingType, setBridgingType] = useState<"in" | "out" | undefined>();

  const [bridgingDone, setBridgingDone] = useState<"yes" | "no" | undefined>();
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
          active={bridgingType == "in"}
          onClick={() => {
            setBridgingType("in");
          }}
        />
        <TextSwitch
          text="get funds out of canto"
          active={bridgingType == "out"}
          onClick={() => setBridgingType("out")}
        />
      </div>

      <Text type="text" size="title3">
        Has your gravity Bridge transaction completed ?
      </Text>
      <div className="row">
        <TextSwitch
          text="mainnet to gBridge"
          active={bridgingDone == "yes"}
          onClick={() => {
            setBridgingDone("yes");
          }}
        />
        <TextSwitch
          text="gBridge to canto(EVM)"
          active={bridgingDone == "no"}
          onClick={() => setBridgingDone("no")}
        />
      </div>

      <div className="row">
        <OutlinedButton>Prev</OutlinedButton>
        <PrimaryButton>Next</PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
`;

export default IntroPage;

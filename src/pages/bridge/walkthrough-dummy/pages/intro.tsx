import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { useState } from "react";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

const IntroPage = () => {
  const [bridgingType, setBridgingType] = useState<"in" | "out" | undefined>();

  const [bridgingDone, setBridgingDone] = useState<"yes" | "no" | undefined>();
  return (
    <Styled>
      <Text type="text" size="title2">
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

      <Text type="text" size="title2">
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
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
`;

export default IntroPage;

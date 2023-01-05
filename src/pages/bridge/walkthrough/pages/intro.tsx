import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import TextSwitch from "../../walkthrough-dummy/components/TextSwitch";
import BaseStyled from "./layout";

interface IntroPageProps {
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  currentBridgeType: "IN" | "OUT" | "NONE";
  canSkip: boolean;
  setSkipDecision: (skip: boolean) => void;
  currentSkipDecision: boolean;
  onNext: () => void;
}
const IntroPage = (props: IntroPageProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Getting Started
        </Text>
        <Text type="text" size="title3">
          What would you like to do ?
        </Text>
      </header>
      <section>
        <div className="row">
          <TextSwitch
            text="get funds into canto"
            active={props.currentBridgeType == "IN"}
            onClick={() => {
              props.setBridgeType("IN");
            }}
          />
          <TextSwitch
            text="get funds out of canto"
            active={props.currentBridgeType == "OUT"}
            onClick={() => props.setBridgeType("OUT")}
          />
        </div>

        {props.canSkip && (
          <>
            <Text type="text" size="title3">
              Has your gravity Bridge transaction completed ?
            </Text>
            <div className="row">
              <TextSwitch
                text="mainnet to gBridge"
                active={!props.currentSkipDecision}
                onClick={() => {
                  props.setSkipDecision(false);
                }}
              />
              <TextSwitch
                text="gBridge to canto(EVM)"
                active={props.currentSkipDecision}
                onClick={() => props.setSkipDecision(true)}
              />
            </div>
          </>
        )}
      </section>
      <footer>
        <div className="row">
          <OutlinedButton disabled>Prev</OutlinedButton>
          <PrimaryButton onClick={props.onNext}>Next</PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
`;

export default IntroPage;

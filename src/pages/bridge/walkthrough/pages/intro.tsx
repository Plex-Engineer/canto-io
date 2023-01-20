import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useNavigate } from "react-router-dom";
import TextSwitch from "../components/TextSwitch";
import TokenTable from "../components/tokenTable";
import BaseStyled from "./layout";

interface IntroPageProps {
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  currentBridgeType: "IN" | "OUT" | "NONE";
  canSkip: boolean;
  setSkipDecision: (skip: boolean) => void;
  currentSkipDecision: boolean;
  onNext: () => void;
  canBridgeIn: boolean;
  canBridgeOut: boolean;
}
const IntroPage = (props: IntroPageProps) => {
  const navigate = useNavigate();

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
        <div>
          <Text
            type="title"
            align="left"
            style={{
              marginBottom: "1rem",
            }}
          >
            Token Balances
          </Text>
          <TokenTable
            tokens={[
              { name: "wETH", main: "0.3", gBridge: "0.2", canto: "1.2" },
              { name: "USDC", main: "220.00", gBridge: "0.29", canto: "134.2" },
              {
                name: "USDT",
                main: "10000.2",
                gBridge: "344.4",
                canto: "122.2",
              },
            ]}
          />
        </div>
        <div className="row">
          <TextSwitch
            text="get funds into canto"
            active={props.currentBridgeType == "IN"}
            onClick={() => {
              props.setBridgeType("IN");
            }}
            disabled={!props.canBridgeIn}
          />
          <TextSwitch
            text="get funds out of canto"
            active={props.currentBridgeType == "OUT"}
            onClick={() => props.setBridgeType("OUT")}
            disabled={!props.canBridgeOut}
          />
        </div>

        {props.canSkip && props.currentBridgeType != "NONE" && (
          <>
            <Text type="text" size="title3">
              {props.currentBridgeType == "IN"
                ? "Has your gravity Bridge transaction completed ?"
                : "Have you already sent funds to the canto bridge ?"}
            </Text>
            <div className="row">
              <TextSwitch
                text="no"
                active={!props.currentSkipDecision}
                onClick={() => {
                  props.setSkipDecision(false);
                }}
                disabled={false}
              />
              <TextSwitch
                text="yes"
                active={props.currentSkipDecision}
                onClick={() => props.setSkipDecision(true)}
                disabled={false}
              />
            </div>
          </>
        )}
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={() => navigate("/bridge")} weight="bold">
            return
          </OutlinedButton>
          <PrimaryButton
            disabled={props.currentBridgeType == "NONE"}
            onClick={props.onNext}
            weight="bold"
          >
            Next
          </PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  .row {
    margin: 0 auto;
  }
`;

export default IntroPage;

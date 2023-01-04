import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { TokenWallet } from "pages/bridge/components/TokenSelect";
import { BaseToken } from "pages/bridge/config/interfaces";
import { BridgeStep, useBridgeWalkthroughStore } from "../store/useWalkthough";

import BaseStyled from "./layout";

interface SelectTokenProps {
  tokenBalance: string;
  tokenList: BaseToken[];
  activeToken: BaseToken;
  onSelect: (token: BaseToken) => void;
}
const SelectTokenPage = (props: SelectTokenProps) => {
  const [popPage, pushPage, bridgeType, bridgeStep] = useBridgeWalkthroughStore(
    (state) => [
      state.popStepTracker,
      state.pushStepTracker,
      state.BridgeType,
      state.BridgeStep,
    ]
  );

  return (
    <Styled>
      <Text type="title" size="title2">
        Bridgin Token
      </Text>
      <div>
        <Text type="text" size="title3" bold>
          Select the token you&#39;d like to bridge{" "}
          {bridgeType == "IN" ? "in" : "out"}
        </Text>
        <Text type="text" size="text3">
          Now that you are on the right network. Please select the token
          you&#39;d like to bridge in.
        </Text>
      </div>
      <TokenWallet
        tokens={props.tokenList}
        activeToken={props.activeToken}
        onSelect={(token) => props.onSelect(token ?? props.activeToken)}
        balance={props.tokenBalance}
      />
      <div className="row">
        <OutlinedButton onClick={() => popPage()}>Prev</OutlinedButton>
        <PrimaryButton
          onClick={() => pushPage(BridgeStep.CHOOSE_AMOUNT)}
          disabled={
            //check selected Token amount and allowance
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
  justify-content: center;
`;

export default SelectTokenPage;

import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { TokenWallet } from "pages/bridge/components/TokenSelect";
import { BaseToken } from "pages/bridge/config/interfaces";
import BaseStyled from "./layout";

interface SelectTokenProps {
  bridgeType: "IN" | "OUT";
  tokenBalance: string;
  tokenList: BaseToken[];
  activeToken: BaseToken;
  onSelect: (token: BaseToken) => void;
  canContinue: boolean;
  onPrev: () => void;
  onNext: () => void;
}
const SelectTokenPage = (props: SelectTokenProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Bridgin Token
        </Text>
        <div>
          <Text type="text" size="title3" bold>
            Select the token you&#39;d like to bridge{" "}
            {props.bridgeType == "IN" ? "in" : "out"}
          </Text>
          <Text type="text" size="text3">
            Now that you are on the right network. Please select the token
            you&#39;d like to bridge in.
          </Text>
        </div>
      </header>
      <section>
        <div className="wallet">
          <TokenWallet
            tokens={props.tokenList}
            activeToken={props.activeToken}
            onSelect={(token) => props.onSelect(token ?? props.activeToken)}
            balance={props.tokenBalance}
          />
        </div>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev}>Prev</OutlinedButton>
          <PrimaryButton onClick={props.onNext} disabled={!props.canContinue}>
            Next
          </PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;

  .wallet {
    width: 20rem;
    & > div {
      border: 1px solid #333;
      border-radius: 4px;
    }
  }
`;

export default SelectTokenPage;

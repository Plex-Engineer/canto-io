import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { truncateNumber } from "global/utils/utils";
import { BaseToken } from "pages/bridge/config/interfaces";
import BaseStyled from "./layout";

interface AmountProps {
  amount: string;
  setAmount: (amount: string) => void;
  max: string;
  onNext: () => void;
  onPrev: () => void;
  canContinue: boolean;
  selectedToken: BaseToken;
}
const AmountPage = (props: AmountProps) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        CHOOSE THE AMOUNT
      </Text>
      <Text type="text" size="title2">
        You are try to bridge out
      </Text>
      <div className="token-details">
        <img src={props.selectedToken.icon} />
        <Text type="text" size="text2">
          {props.selectedToken.name}
        </Text>
        <Text type="text" size="text2">
          {props.max}
        </Text>
      </div>

      <div className="amount">
        <div className="amount-input">
          <Text type="text" size="text2" align="left" color="primary">
            amount you&#39;d like to transfer:
          </Text>

          <CInput
            autoComplete="off"
            type="number"
            name="amount-bridge"
            id="amount-bridge"
            placeholder="enter amount..."
            value={props.amount}
            onChange={(e) => props.setAmount(e.target.value)}
          />
          {Number(props.max) < 0 ? null : (
            <div className="max">
              balance {truncateNumber(props.max)}{" "}
              <span
                tabIndex={0}
                role="button"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => props.setAmount(props.max)}
              >
                max
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <OutlinedButton onClick={props.onPrev}>Prev</OutlinedButton>
        <PrimaryButton onClick={props.onNext}>Next</PrimaryButton>
      </div>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;

  input[type="number"] {
    width: 20rem;
  }

  .token-details {
    background-color: #181818;
    border-radius: 4px;
    border: 1px solid #333;
    width: 20rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    height: 3.4rem;
  }
`;

export default AmountPage;

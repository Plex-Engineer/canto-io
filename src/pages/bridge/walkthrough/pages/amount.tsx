import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { truncateNumber } from "global/utils/utils";
import BaseStyled from "./layout";

interface AmountProps {
  amount: string;
  setAmount: (amount: string) => void;
  max: string;
  onNext: () => void;
  onPrev: () => void;
  canContinue: boolean;
}
const AmountPage = (props: AmountProps) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        CHOOSE THE AMOUNT
      </Text>
      <div className="amount">
        <div className="amount-input">
          <Text type="text" size="text2" align="left" color="primary">
            amount :
          </Text>

          <input
            autoComplete="off"
            type="number"
            name="amount-bridge"
            id="amount-bridge"
            placeholder="0.00"
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
`;

export default AmountPage;

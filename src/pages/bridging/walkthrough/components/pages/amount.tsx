import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { BaseToken } from "pages/bridging/config/interfaces";
import BaseStyled from "../layout";

interface AmountProps {
  amount: string;
  setAmount: (amount: string) => void;
  max: string;
  onNext: () => void;
  onPrev: () => void;
  canContinue: boolean;
  selectedToken: BaseToken;
  canGoBack: boolean;
}
const AmountPage = (props: AmountProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          CHOOSE THE AMOUNT
        </Text>
        <div>
          <Text type="text" size="title3" bold>
            Enter the amount you&#39;d like to transfer
          </Text>
          <Text type="text" size="text3">
            You can either click max or enter a specific amount that you&#39;d
            prefer.
          </Text>
        </div>
      </header>
      <section>
        <div className="token-details">
          <img src={props.selectedToken.icon} height={30} />
          <Text type="text" size="text2">
            {props.selectedToken.name}
          </Text>
          <Text type="text" size="text2" align="right" className="balance">
            balance : {props.max}
          </Text>
        </div>

        <div className="amount">
          <div className="amount-input">
            <Text type="text" size="text2" align="left" color="primary">
              amount you&#39;d like to transfer:
            </Text>
            <div className="max-button">
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
                <div
                  className="max"
                  tabIndex={0}
                  role="button"
                  onClick={() => props.setAmount(props.max)}
                >
                  max
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton disabled={!props.canGoBack} onClick={props.onPrev}>
            Prev
          </OutlinedButton>
          <PrimaryButton
            disabled={!props.canContinue}
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
    height: 3.8rem;
    gap: 1rem;
    padding: 0 1.4rem;
    .balance {
      width: 100%;
    }
  }

  .amount-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .max-button {
    display: flex;
    position: relative;
    .max {
      width: 4rem;
      height: 56px;
      background-color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0 4px 4px 0;
      position: absolute;
      right: 0rem;
      cursor: pointer;
      color: #888;
      &:hover {
        background-color: #444;
        color: white;
      }
    }
  }
`;

export default AmountPage;

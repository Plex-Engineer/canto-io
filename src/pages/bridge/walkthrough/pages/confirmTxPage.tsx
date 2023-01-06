import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { BaseToken } from "pages/bridge/config/interfaces";
import BaseStyled from "./layout";

interface ConfirmationProps {
  token: BaseToken;
  amount: string;
  txType: string;
  onTxConfirm: () => void;
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  canGoBack: boolean;
}
export const ConfirmTransactionPage = (props: ConfirmationProps) => {
  function capitalizeFirstLetter(text: string) {
    return text
      .split(" ")
      .flatMap((val) => val.charAt(0).toUpperCase() + val.slice(1) + " ");
  }
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Confirmation
        </Text>
        <div>
          <Text type="text" size="title3" bold>
            Please confirm the details provided under
          </Text>
          <Text type="text" size="text3">
            By clicking confirm you are agreeing to send {props.amount}{" "}
            {props.token.name}
          </Text>
        </div>
      </header>
      <section>
        <div className="box">
          <Text type="text" size="title3">
            Transaction Type
          </Text>
          <Text type="text" size="title3">
            {capitalizeFirstLetter(props.txType.toLowerCase())}
          </Text>
          <Text type="text" size="title3">
            Token:
          </Text>

          <Text
            type="text"
            size="title3"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>
              <img src={props.token.icon} alt={props.token.name} height={20} />
            </span>
            {props.token.name}
          </Text>

          <Text type="text" size="title3">
            Amount:
          </Text>
          <Text type="text" size="title3">
            {props.amount}
          </Text>
        </div>
        <PrimaryButton disabled={props.canContinue} onClick={props.onTxConfirm}>
          Confirm
        </PrimaryButton>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton disabled={!props.canGoBack} onClick={props.onPrev}>
            Prev
          </OutlinedButton>
          <PrimaryButton disabled={!props.canContinue} onClick={props.onNext}>
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

  .box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    border: 1px solid #222;
    background-color: #111;
    border-radius: 4px;
    grid-gap: 0;
    & > * {
      border: 1px solid #1e1e1e;
      padding: 1rem;
    }
  }
  section {
    align-items: center;
    button {
      width: 16rem;
    }
  }
`;

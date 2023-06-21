import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { ReactNode } from "react";
import BaseStyled from "../layout";
import { Token } from "global/config/interfaces/tokens";

interface ConfirmationProps {
  token: Token;
  notEnoughCantoBalance: boolean;
  amount: string;
  txType: string;
  txShortDesc: string;
  txStatus: ReactNode | undefined;
  txCompletedDesc?: string;
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
  const txInProgress =
    props.txStatus === "Mining" || props.txStatus === "PendingSignature";
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
            By clicking confirm you are agreeing to {props.txShortDesc}
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
          {Number(props.amount) == 0 ? null : (
            <>
              {" "}
              <Text type="text" size="title3">
                Amount:
              </Text>
              <Text type="text" size="title3">
                {props.amount}
              </Text>
            </>
          )}

          <Text type="text" size="title3">
            Transaction Status:
          </Text>
          <Text type="text" size="title3">
            {props.txStatus ?? "None"}
          </Text>
        </div>
        <PrimaryButton
          disabled={
            props.canContinue || props.notEnoughCantoBalance || txInProgress
          }
          onClick={props.onTxConfirm}
        >
          Confirm
        </PrimaryButton>
        {props.notEnoughCantoBalance && (
          <Text type="text">
            you do not have enough canto to perform this transaction you must
            have at leat 3 Canto in your Metamask wallet. If necessary, you can
            request a drip from the #social-faucet on the{" "}
            <a href="https://discord.gg/ucRX6XCFbr"> Canto discord</a>
          </Text>
        )}
        {props.canContinue && props.txCompletedDesc && (
          <Text type="text">{props.txCompletedDesc}</Text>
        )}
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

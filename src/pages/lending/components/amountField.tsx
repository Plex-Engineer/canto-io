import styled from "@emotion/styled";
import { CantoTransactionType } from "global/config/transactionTypes";
import { UserLMTokenDetails } from "../config/interfaces";
import AmountBox from "global/components/amount";
import { CInput } from "global/packages/src/components/atoms/Input";
import { Text } from "global/packages/src";

const Styled = styled.div`
  height: 58px;
  background: #060606;
  border: 1px solid #2e2d2d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  min-width: 18rem;
  width: 100%;

  .maxBtn {
    height: 100%;
    width: 7rem;
    margin-left: 3px;
    background-color: #252525;

    border: none;
    &:hover {
      background-color: #333;
      cursor: pointer;
      p {
        color: white;
      }
    }

    p {
      color: #999;
    }
  }
`;

type Props = {
  balance: string;
  token: UserLMTokenDetails;
  transactionType: CantoTransactionType;
  onChange: (value: string) => void;
  onMax: () => void;
  value: string;
  canDoMax: boolean;
};

const AmountField = (props: Props) => {
  return (
    <Styled className="amount-field">
      <CInput
        type="number"
        style={{
          backgroundColor: "transparent",
          width: "100%",
          height: "54px",
        }}
        placeholder={"amount :" + props.balance}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      <button className="maxBtn" onClick={() => props.onMax()}>
        <Text>{!props.canDoMax ? "80%" : "max"}</Text>
      </button>
    </Styled>
  );
};

export default AmountField;

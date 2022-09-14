import styled from "@emotion/styled";
import { useState } from "react";
import { TrasanctionType } from "./BorrowLimits";
import { formatBalance } from "global/utils/utils";

type styleProps = {
  focused: boolean;
};
const Container = styled.div<styleProps>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.focused ? "#001A0E" : "#191919")};
  border: ${(props) =>
    props.focused ? "1px solid #06FC99" : "1px solid #191919"};
  color: #efefef;
  height: 100px;
  flex: 1;
  padding: 0 1rem;
  margin: 1px;
  justify-content: space-around;

  &:hover {
    background-color: #001a0e;
    cursor: text;
    input {
      background-color: #001a0e !important;
    }
  }
  input[type="text"] {
    background-color: ${(props) => (props.focused ? "#001A0E" : "#191919")};
    font-size: 24px;
    width: 100%;
    border: none;
    font-weight: 300;
    color: ${(props) => (props.focused ? "var(--primary-color)" : "#efefef")};
    &:focus {
      outline: none;
    }
  }

  p {
    color: #6f6f6f;
    letter-spacing: -0.03em;
    text-align: right;
    font-size: 16px;
  }
`;

const Max = styled.span`
  color: #6f6f6f;
  font-size: 22px;
  &:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
`;

type Props = {
  balance: string;
  type?: string;
  hasToken?: boolean;
  token?: any;
  limit?: number;
  transactionType: TrasanctionType;
  onChange?: (value: string) => void;
  onMax: (value: string) => void;
  value: string;
};

const LendingField = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  //used for showing whatever max value they can input
  const [remaining, setRemaining] = useState(props.balance);
  const [value, setValue] = useState(props.value);
  const [cursorPosition, setCursorPosition] = useState(0);

  const InputValue = () => (
    <input
      id="inputText"
      type="text"
      placeholder={"0.00"}
      autoFocus={isFocused}
      value={value}
      onFocus={(e) => {
        //move cursor back to where user made the edit
        e.target.setSelectionRange(cursorPosition, cursorPosition);
        setIsFocused(true);
      }}
      onChange={(e) => {
        //capture cursor position
        setCursorPosition(e.target.selectionStart ?? 0);

        setValue(e.target.value);

        if (
          Number(e.target.value) > Number(props.balance) ||
          isNaN(Number(e.target.value))
        ) {
          setRemaining("0");
        } else {
          setRemaining(
            (Number(props.balance) - Number(e.target.value)).toString()
          );
        }
        if (props.onChange != undefined) {
          props.onChange(e.target.value);
        }
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    />
  );
  return (
    <Container onClick={() => setIsFocused(true)} focused={isFocused}>
      <div
        style={{
          display: "flex",
        }}
      >
        <InputValue />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>{formatBalance(props.balance)}</p>
        <p>
          <Max
            onClick={() => {
              if (props.limit != undefined) {
                setValue(props.limit.toString());
              } else {
                setValue(props.balance.toString());
              }
              props.onMax(props.balance);

              setRemaining("0");
            }}
          >
            {(props.transactionType != TrasanctionType.BORROW &&
              props.limit === undefined) ||
            props.transactionType == TrasanctionType.REPAY
              ? "max"
              : "80% limit"}
          </Max>
        </p>
      </div>
    </Container>
  );
};

export default LendingField;

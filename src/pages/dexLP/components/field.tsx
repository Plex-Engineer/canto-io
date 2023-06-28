import styled from "@emotion/styled";
import { truncateNumber } from "global/utils/formattingNumbers";
import { useState } from "react";
import { FieldContainer } from "./Styled";

type styleProps = {
  focused: boolean;
};

const primaryColor = "var(--primary-color)";

const Max = styled.span`
  color: var(--primary-color);
  &:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
`;

const IconName = styled.div<styleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  border: 2px solid #191919;
  background-color: black;
  border-radius: 4px;
  /* border-bottom: 1px solid
    ${(props) => (props.focused ? primaryColor : "black")}; */
  /* background-color: #8bff8945; */
  p {
    color: ${(props) => (props.focused ? primaryColor : "#efefef")};
    padding: 0;
    margin: 0;
  }
`;

type Props = {
  placeholder: string;
  balance: string;
  type?: string;
  hasToken?: boolean;
  token?: string;
  limit: string;
  onChange: (value: string) => void;
  value: string;
  icon: string;
  tokenDecimals: number;
};

const Field = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const InputValue = () => (
    <input
      type="text"
      placeholder={props.placeholder}
      autoFocus={isFocused}
      value={props.value}
      onFocus={(e) => {
        //move cursor back to user edit
        e.target.setSelectionRange(cursorPosition, cursorPosition);
        setIsFocused(true);
      }}
      onChange={(e) => {
        //save cursor position to be moved back later
        setCursorPosition(e.target.selectionStart ?? 0);
        props.onChange(e.target.value);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    />
  );
  return (
    <FieldContainer onClick={() => setIsFocused(true)} focused={isFocused}>
      <IconName focused={isFocused}>
        <img src={props.icon} height={20} />
        <p>{props.token}</p>
      </IconName>
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
          position: "absolute",
          right: "30px",
          justifyContent: "space-between",
        }}
      >
        <p>{truncateNumber(props.balance)}</p>
        <p>
          <Max
            onClick={() => {
              props.onChange(
                truncateNumber(
                  props.limit.toString(),
                  props.tokenDecimals == 6 ? 4 : 8
                )
              );
            }}
          >
            max
          </Max>
        </p>
      </div>
    </FieldContainer>
  );
};

export default Field;

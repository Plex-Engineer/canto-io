import styled from "@emotion/styled";
import { formatBalance } from "global/utils/utils";
import { useEffect, useState } from "react";


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
  height: 130px;
  flex: 1;
  margin: 1px;

  &:hover {
    background-color: #001a0e;
    cursor: text;
    input {
      background-color: #001a0e !important;
    }
  }
  input[type="text"] {
    padding: 0 1rem;
    margin-top: 1rem;
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
    margin-top: 0.4rem;
    color: #6f6f6f;
    letter-spacing: -0.03em;
    text-align: right;
    font-size: 16px;
    padding: 0 1rem;
  }
`;

const Max = styled.span`
  color: var(--primary-color);
  &:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
`;

const IconName = styled.div<styleProps>`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  width: 100%;
  margin-bottom: 0px;
  border: 2px solid #191919;
  border-bottom: none;
  background-color: ${(props) => (props.focused ? "black" : "black")};
  border-bottom: 1px solid ${(props) => (props.focused ? "var(--primary-color)" : "black")};
  /* background-color: #8bff8945; */
  p {
    color: ${(props) => (props.focused ? "var(--primary-color)" : "#efefef")};

    padding: 0;
    margin: 0;

  }
`;

type Props = {
  placeholder: string;
  balance: number;
  type?: string;
  hasToken?: boolean;
  token?: any;
  limit: number;
  onChange: (value: string) => void;
  value: string;
  icon: string;
  remaining: number;
};

const Field = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [remaining, setRemaining] = useState(props.balance);
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    if (
      props.remaining < 0 || isNaN(props.remaining)
    ) {
      setRemaining(0);
    } else {
      setRemaining(props.remaining);
    }
  }, [props.remaining])
  const InputValue = () => (
    <input
      type="text"
      placeholder={props.placeholder}
      autoFocus={isFocused}
      value={props.value}
      onFocus={(e) => {
        //move cursor back to user edit
        e.target.setSelectionRange(cursorPosition, cursorPosition)
        setIsFocused(true);
      }}

      onChange={(e) => {
        //save cursor position to be moved back later
        setCursorPosition(e.target.selectionStart ?? 0)
        props.onChange(e.target.value);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    />
  );
  return (
    <Container onClick={() => setIsFocused(true)} focused={isFocused}>
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
          justifyContent: "space-between",
        }}
      >
        <p>{formatBalance(remaining)}</p>
        <p>
          <Max
            onClick={() => {
                props.onChange(props.limit.toString());
            }}
          >
            max
          </Max>
        </p>
      </div>
    </Container>
  );
};

export default Field;

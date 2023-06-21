import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
interface props {
  value: number;
}
const primaryColor = "var(--primary-color)";
const Container = styled.div<props>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1px;

  input {
    background-color: #222;
    border: 1px solid transparent;

    padding: 0.5rem;
    color: ${(props) => (props.value <= 0 ? "#ff4646" : primaryColor)};

    &:hover {
      border: 1px solid
        ${(props) => (props.value <= 0 ? "#ff4646" : primaryColor)};
    }
    &:focus {
      outline: 1px solid
        ${(props) => (props.value <= 0 ? "#ff4646" : primaryColor)};
      color: ${(props) => (props.value <= 0 ? "#ff4646" : primaryColor)};
    }
  }

  p {
    font-style: normal;
    font-weight: 400;
    color: ${(props) => (props.value <= 0 ? "#ff4646" : "white")};
    font-size: 18px;
    line-height: 21px;
    letter-spacing: -0.03em;

    &:focus {
      color: ${(props) =>
        props.value <= 0 ? "#ff4646" : "var(--primary-color)"};
    }
  }
`;
interface DexProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}
const Input = ({ name, value, onChange }: DexProps) => {
  return (
    <Container value={Number(value)}>
      {/* <label htmlFor="item">{name}</label> */}
      <Text align="left" type="title">
        {name}
      </Text>
      <CInput
        autoComplete="off"
        spellCheck={false}
        type="text"
        name="item"
        id="item"
        placeholder="0.00"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </Container>
  );
};

export default Input;

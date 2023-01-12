import styled from "@emotion/styled";
import { Text } from "global/packages/src";

interface Props {
  onClick?: () => void;
  text: string;
  disabled: boolean;
  children?: React.ReactNode;
  active?: boolean;
}
const TextSwitch = (props: Props) => {
  return (
    <Styled
      disabled={props.disabled}
      style={{
        backgroundColor: props.active
          ? "rgba(6, 252, 153, 0.2)"
          : props.disabled
          ? "var(--pitch-black-color)"
          : "",
      }}
      onClick={
        !props.disabled
          ? props.onClick
          : () => {
              return;
            }
      }
    >
      <div className="checkbox">
        <div
          className={`${props.active ? "active inactive" : " inactive"} `}
        ></div>
      </div>
      <Text type="text" style={{ color: props.disabled ? "#006739" : "" }}>
        {props.text}
      </Text>
      {props.children}
    </Styled>
  );
};

interface DisableProps {
  disabled: boolean;
}
const Styled = styled.div<DisableProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 308px;
  height: 104px;
  border: ${(props) =>
    props.disabled ? "1px solid #006739" : "1px solid var(--primary-color)"};
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(6, 252, 153, 0.15);
    transition: all 0.2s ease;
  }
  cursor: pointer;
  .checkbox {
    height: 22px;
    width: 22px;
    border: ${(props) =>
      props.disabled ? "1px solid #006739" : "1px solid var(--primary-color)"};
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inactive {
    height: 15px;
    width: 15px;
    border-radius: 50px;
    background-color: var(--primary-color);
    transform: scale(0);
    transition: all 0.2s ease;
  }
  .active {
    transform: scale(1);
  }
`;

export default TextSwitch;

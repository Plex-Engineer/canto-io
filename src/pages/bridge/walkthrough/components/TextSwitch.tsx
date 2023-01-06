import styled from "@emotion/styled";
import { Text } from "global/packages/src";

interface Props {
  onClick?: () => void;
  text: string;
  children?: React.ReactNode;
  active?: boolean;
}
const TextSwitch = (props: Props) => {
  return (
    <Styled
      style={{
        backgroundColor: props.active ? "rgba(6, 252, 153, 0.2)" : "",
      }}
      onClick={props.onClick}
    >
      <div className="checkbox">
        <div
          className={`${props.active ? "active inactive" : " inactive"} `}
        ></div>
      </div>
      <Text type="text">{props.text}</Text>
      {props.children}
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 308px;
  height: 104px;
  border: 1px solid #06fc99;
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
    border: 1px solid var(--primary-color);
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

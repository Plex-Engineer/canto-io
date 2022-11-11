import styled from "@emotion/styled";
import { Text } from "global/packages/src";

interface SpecialTabsProps {
  onLeftTabClick: () => void;
  onRightTabClick: () => void;
  active: boolean;
}
interface ActiveProps {
  active: boolean;
}
export const SpecialTabs = (props: SpecialTabsProps) => {
  const TabBar = styled.div`
    display: flex;
    gap: 10px;
    border-radius: 4px;
  `;
  const Tab = styled.div<ActiveProps>`
    width: 50%;
    text-align: center;
    padding: 1rem;
    background-color: #000000;
    @media (max-width: 1000px) {
      background-color: ${(props) => (props.active ? "#0f742f" : "#0a2d15")};
      &:hover {
        background-color: #0f742f;
        cursor: pointer;
      }
    }
  `;

  return (
    <TabBar>
      <Tab active={props.active} data-active onClick={props.onLeftTabClick}>
        <Text type="title">supply</Text>
      </Tab>
      <Tab active={!props.active} onClick={props.onRightTabClick}>
        <Text type="title">borrow</Text>
      </Tab>
    </TabBar>
  );
};

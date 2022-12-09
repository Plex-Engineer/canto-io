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
    margin-top: -2rem;
    border-radius: 4px;
  `;
  const Tab = styled.div<ActiveProps>`
    text-align: center;
    padding: 1rem;
    width: 100%;
    border-bottom: 1px solid var(--primary-color);
    @media (max-width: 1000px) {
      background-color: ${(props) =>
        props.active ? "rgba(6, 252, 153, 0.1)" : "transparent"};
      border-bottom: 4px solid
        ${(props) => (props.active ? "var(--primary-color)" : "none")};

      &:hover {
        cursor: pointer;
      }
    }
  `;

  return (
    <TabBar>
      <Tab active={props.active} data-active onClick={props.onLeftTabClick}>
        <Text type="text" size="text3" bold>
          supply
        </Text>
      </Tab>
      <Tab active={!props.active} onClick={props.onRightTabClick}>
        <Text type="text" size="text3" bold>
          borrow
        </Text>
      </Tab>
    </TabBar>
  );
};

import styled from "@emotion/styled";

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
  `;
  const Tab = styled.div<ActiveProps>`
    width: 50%;
    text-align: center;
    background-color: #0a2d15;
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
        supply
      </Tab>
      <Tab active={!props.active} onClick={props.onRightTabClick}>
        borrow
      </Tab>
    </TabBar>
  );
};

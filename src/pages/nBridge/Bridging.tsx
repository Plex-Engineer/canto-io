import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { selectedEmptyToken, useBridgeStore } from "./stores/gravityStore";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";

const NBridgingPage = () => {
  const bridgeStore = useBridgeStore();
  return (
    <Styled>
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => bridgeStore.setSelectedToken(selectedEmptyToken)}
          >
            bridge In
          </Tab>
          <Tab
            className="tab"
            // resetting the selected token when a new tab is selected
            onClick={() => bridgeStore.setSelectedToken(selectedEmptyToken)}
          >
            bridge Out
          </Tab>
        </TabList>
        <TabPanel>
          <BridgeIn />
        </TabPanel>
        <TabPanel>
          <BridgeOut />
        </TabPanel>
      </Tabs>
    </Styled>
  );
};

const Styled = styled.div`
  background-color: black;
  min-height: 80vh;
  max-width: 1024px;

  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tabs {
    width: 100%;
  }
  .tab {
    background-color: var(--pitch-black-color);
    height: 50px;
    color: var(--primary-color);
    outline: none;
    width: 200px;
    border-radius: 0%;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.4s;
    &:hover {
      background-color: #283b2d;
      border-bottom: 4px solid var(--primary-color);
    }
  }
  .tablist {
    display: flex;
    justify-content: center;
    background-color: var(--pitch-black-color);
  }
  .react-tabs__tab--selected {
    border-bottom: 4px solid var(--primary-color);
    border-top: none;
    background-color: #19251c;
  }
  .react-tabs__tab--disabled {
  }
`;

export default NBridgingPage;

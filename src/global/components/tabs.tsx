import styled from "@emotion/styled";
import { ReactNode } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

interface Props {
  names: string[];
  panels: ReactNode[];
}
const CantoTabs = (props: Props) => {
  return (
    <Styled>
      <Tabs className="tabs">
        <TabList className="tablist">
          {props.names.map((label, idx) => (
            <Tab className="tab" key={idx}>
              {label}
            </Tab>
          ))}
        </TabList>
        <>
          {props.panels.map((panel, idx) => (
            <TabPanel key={idx}>{panel}</TabPanel>
          ))}
        </>
      </Tabs>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: calc(100vh - 10.65rem);
  max-width: 1200px;
  margin: 0 auto;

  .tabs {
    width: 100%;
    display: flex;
    min-height: 75vh;
    flex-direction: column;
    justify-content: start;
  }
  .tab {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 80px;
    color: var(--primary-color);
    outline: none;
    width: 174px;
    border-radius: 0%;
    border: 1px solid transparent;
    padding: 1.8rem 0;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      border: none;
      background-color: #06fc9a4c;
      border-bottom: 4px solid var(--primary-color);
      border-top: 4px solid transparent;
    }
  }
  .tablist {
    display: flex;
    justify-content: center;
  }
  .react-tabs__tab--selected {
    border: none;
    border-bottom: 4px solid var(--primary-color);
    border-top: 4px solid transparent;

    background-color: #06fc991a;
  }
  .react-tabs__tab--disabled {
  }
  .react-tabs__tab-panel {
    max-width: 1200px;
    width: 100vw;

    flex-grow: 1;
  }

  .react-tabs__tab-panel--selected {
    border-top: 1px solid var(--primary-color);
    display: flex;
    justify-content: center;
    background-color: black;
    min-height: 47rem;
  }

  @media (max-width: 1000px) {
    width: 100%;
    .tablist {
      width: 100vw;
    }
    .tab {
      width: 9rem;
      padding: 1.8rem 0;
    }

    .react-tabs__tab-panel--selected {
      width: 100%;
    }
  }
`;

export default CantoTabs;

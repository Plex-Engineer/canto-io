import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyStaking from "./tabs/myStaking";
import AllDerevatives from "./tabs/allDerevatives";
import Transactions from "./tabs/transactions";
import Styled from "./style";

const NStaking = () => {
  return (
    <Styled>
      <Tabs className={"tabs"}>
        <TabList>
          <Tab>my staking</Tab>
          <Tab>all derevatives</Tab>
          <Tab>transactions</Tab>
        </TabList>

        <TabPanel>
          <MyStaking />
        </TabPanel>
        <TabPanel>
          <AllDerevatives />
        </TabPanel>
        <TabPanel>
          <Transactions />
        </TabPanel>
      </Tabs>
    </Styled>
  );
};

export default NStaking;

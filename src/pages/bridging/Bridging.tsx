import CantoTabs from "global/components/tabs";
import { Text } from "global/packages/src";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./Transactions";

const Bridging = () => {
  return (
    <div>
      <CantoTabs
        names={["bridge In", "bridge Out", "Transactions"]}
        panels={[
          <BridgeIn key={"in"} />,
          <BridgeOut key={"in"} />,
          <Transactions key={"transaction"} />,
        ]}
      />
    </div>
  );
};

export default Bridging;

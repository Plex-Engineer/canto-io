import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import CantoTabs from "global/components/tabs";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./Transactions";
import { useTransactionHistory } from "./hooks/useTransactionHistory";
import { useNetworkInfo } from "global/stores/networkInfo";
import { createConvertTransactions } from "./utils/utils";

const Bridging = () => {
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const bridgingTxs = useTransactionHistory();
  return (
    <div>
      <CantoTabs
        names={["bridge In", "bridge Out", "Transactions"]}
        panels={[
          <BridgeIn
            key={"in"}
            ethAddress={networkInfo.account}
            cantoAddress={networkInfo.cantoAddress}
            step2Transactions={createConvertTransactions(
              bridgingTxs.pendingBridgeInTransactions,
              bridgingTokens.userConvertTokens
            )}
            ethGBridgeTokens={bridgingTokens.userBridgeInTokens}
          />,
          <BridgeOut key={"out"} />,
          <Transactions key={"transaction"} />,
        ]}
      />
    </div>
  );
};

export default Bridging;

import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import CantoTabs from "global/components/tabs";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./TransactionHistory";
import { useTransactionHistory } from "./hooks/useTransactionHistory";
import { useNetworkInfo } from "global/stores/networkInfo";
import { createConvertTransactions } from "./utils/utils";
import { SelectedTokens } from "./stores/bridgeTokenStore";
import { BaseToken } from "./config/interfaces";

const Bridging = () => {
  const networkInfo = useNetworkInfo();
  const bridgingTokens = useBridgeTokenInfo();
  const bridgingHistory = useTransactionHistory();
  return (
    <div>
      <CantoTabs
        names={["bridge In", "bridge Out", "transactions"]}
        panels={[
          <BridgeIn
            key={"in"}
            ethAddress={networkInfo.account}
            cantoAddress={networkInfo.cantoAddress}
            step2Transactions={createConvertTransactions(
              bridgingHistory.pendingBridgeInTransactions,
              bridgingTokens.userConvertTokens
            )}
            ethGBridgeTokens={bridgingTokens.userBridgeInTokens}
            selectedEthToken={
              bridgingTokens.selectedTokens[SelectedTokens.ETHTOKEN]
            }
            selectEthToken={(token: BaseToken) =>
              bridgingTokens.setSelectedToken(token, SelectedTokens.ETHTOKEN)
            }
          />,
          <BridgeOut
            key={"out"}
            ethAddress={networkInfo.account}
            cantoAddress={networkInfo.cantoAddress}
            step2Transactions={createConvertTransactions(
              [],
              bridgingTokens.userConvertTokens
            )}
            convertTokens={bridgingTokens.userConvertTokens}
            selectedConvertToken={
              bridgingTokens.selectedTokens[SelectedTokens.CONVERTOUT]
            }
            selectToken={(token: BaseToken) =>
              bridgingTokens.setSelectedToken(token, SelectedTokens.CONVERTOUT)
            }
          />,
          <Transactions
            key={"transaction"}
            allTransactions={bridgingHistory}
          />,
        ]}
      />
    </div>
  );
};

export default Bridging;

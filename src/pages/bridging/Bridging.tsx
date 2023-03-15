import { useBridgeTokenInfo } from "./hooks/useBridgeTokenInfo";
import CantoTabs from "global/components/tabs";
import BridgeIn from "./BridgeIn";
import BridgeOut from "./BridgeOut";
import Transactions from "./TransactionHistory";
import { useTransactionHistory } from "./hooks/useTransactionHistory";
import { useNetworkInfo } from "global/stores/networkInfo";
import { createConvertTransactions } from "./utils/utils";
import { SelectedTokens } from "./stores/bridgeTokenStore";

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
            ethGBridgeTokens={bridgingTokens.userBridgeInTokens}
            selectedEthToken={bridgingTokens.selectedTokens.bridgeInToken}
            selectEthToken={(token) =>
              bridgingTokens.setSelectedToken(
                token.address,
                SelectedTokens.ETHTOKEN
              )
            }
            step2Transactions={createConvertTransactions(
              bridgingHistory.pendingBridgeInTransactions,
              bridgingTokens.userNativeTokens
            )}
          />,
          <BridgeOut
            key={"out"}
            ethAddress={networkInfo.account}
            cantoAddress={networkInfo.cantoAddress}
            bridgeOutTokens={bridgingTokens.userBridgeOutTokens}
            selectedBridgeOutToken={
              bridgingTokens.selectedTokens.bridgeOutToken
            }
            selectToken={(token) =>
              bridgingTokens.setSelectedToken(
                token.address,
                SelectedTokens.CONVERTOUT
              )
            }
            step2Transactions={createConvertTransactions(
              [],
              bridgingTokens.userNativeTokens
            )}
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

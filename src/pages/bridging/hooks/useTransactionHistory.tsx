import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import {
  TransactionHistoryEvent,
  getBridgeInEventsWithStatus,
  getIBCOutTransactions,
} from "../utils/bridgeTxHistory";

interface AllBridgeTxHistory {
  bridgeOutTransactions: TransactionHistoryEvent[];
  completeBridgeInTransactions: TransactionHistoryEvent[];
  pendingBridgeInTransactions: TransactionHistoryEvent[];
}
export function useTransactionHistory(): AllBridgeTxHistory {
  const networkInfo = useNetworkInfo();
  const [bridgeOutTransactions, setBridgeOutTransactions] = useState<
    TransactionHistoryEvent[]
  >([]);
  const [completeBridgeInTransactions, setCompleteBridgeInTransactions] =
    useState<TransactionHistoryEvent[]>([]);
  const [pendingBridgeInTransactions, setPendingBridgeInTransactions] =
    useState<TransactionHistoryEvent[]>([]);

  async function setAllTransactions() {
    if (networkInfo.account && networkInfo.cantoAddress) {
      const [completed, pending] = await getBridgeInEventsWithStatus(
        networkInfo.account,
        networkInfo.cantoAddress
      );
      setCompleteBridgeInTransactions(completed);
      setPendingBridgeInTransactions(pending);

      setBridgeOutTransactions(
        await getIBCOutTransactions(networkInfo.cantoAddress)
      );
    }
  }
  useEffect(() => {
    setAllTransactions();
  }, [networkInfo.cantoAddress]);
  //call data per 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await setAllTransactions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    bridgeOutTransactions,
    completeBridgeInTransactions,
    pendingBridgeInTransactions,
  };
}

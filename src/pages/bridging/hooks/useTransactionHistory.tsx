import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import { useBridgeTransactionPageStore } from "../stores/transactionHistoryStore";
import {
  TransactionHistoryEvent,
  getBridgeInEventsWithStatus,
  getIBCOutTransactions,
} from "../utils/bridgeTxHistory";

export interface AllBridgeTxHistory {
  bridgeOutTransactions: TransactionHistoryEvent[];
  completeBridgeInTransactions: TransactionHistoryEvent[];
  pendingBridgeInTransactions: TransactionHistoryEvent[];
}
export function useTransactionHistory(): AllBridgeTxHistory {
  const networkInfo = useNetworkInfo();
  const txStore = useBridgeTransactionPageStore();
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
      const ibcOut = await getIBCOutTransactions(networkInfo.cantoAddress);
      setBridgeOutTransactions(ibcOut);
      txStore.setNewTransactions(
        completed.length + pending.length + ibcOut.length,
        networkInfo.account
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

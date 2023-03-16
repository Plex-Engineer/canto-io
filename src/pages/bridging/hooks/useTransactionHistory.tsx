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
      const ibcOut = await getIBCOutTransactions(networkInfo.cantoAddress);
      let actualTxs = 0;
      //must check that the api does not return nothing. Only take the max
      if (completed.length >= completeBridgeInTransactions.length) {
        setCompleteBridgeInTransactions(completed);
        actualTxs += completed.length;
      }
      if (pending.length >= pendingBridgeInTransactions.length) {
        setPendingBridgeInTransactions(pending);
        actualTxs += pending.length;
      }
      if (ibcOut.length >= bridgeOutTransactions.length) {
        setBridgeOutTransactions(ibcOut);
        actualTxs += ibcOut.length;
      }
      txStore.setNewTransactions(actualTxs, networkInfo.account);
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

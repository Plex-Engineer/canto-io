import { useEffect } from "react";
import { useTransactionChecklistStore } from "../stores/transactionChecklistStore";
import { useBridgeTransactionPageStore } from "../stores/transactionPageStore";
import { updateLastBridgeInTransactionStatus } from "../utils/checklistFunctions";

export function useBridgeInChecklistSetter(
  currentTxType: "Bridge" | "Convert",
  chainId: number,
  bridgeDisabled: boolean,
  convertDisabled: boolean
) {
  //store for transactionchecklist
  const transactionChecklistStore = useTransactionChecklistStore();
  const completedTransactions =
    useBridgeTransactionPageStore().transactions.completedBridgeTransactions;

  function updateBridgeInChecklist() {
    const currentTx = transactionChecklistStore.getCurrentBridgeInTx();
    if (currentTx) {
      updateLastBridgeInTransactionStatus(
        (status, txHash) =>
          transactionChecklistStore.updateCurrentBridgeInStatus(status, txHash),
        currentTx,
        currentTxType,
        chainId,
        bridgeDisabled,
        completedTransactions,
        convertDisabled
      );
    }
  }

  useEffect(() => {
    if (!transactionChecklistStore.getCurrentBridgeInTx()) {
      transactionChecklistStore.addBridgeInTx();
    }
    updateBridgeInChecklist();
  }, [
    transactionChecklistStore.getCurrentBridgeInTx()?.currentStep,
    currentTxType,
    convertDisabled,
    bridgeDisabled,
    completedTransactions,
    chainId,
  ]);

  return {
    addTx: transactionChecklistStore.addBridgeInTx,
    removeTx: transactionChecklistStore.removeBridgeInTx,
    currentStep:
      transactionChecklistStore.getCurrentBridgeInTx()?.currentStep ?? 0,
    totalTxs: transactionChecklistStore.bridgeIn.transactions.length,
  };
}

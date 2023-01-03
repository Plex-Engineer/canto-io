import { useEffect } from "react";
import { useTransactionChecklistStore } from "../stores/transactionChecklistStore";
import { updateLastBridgeOutTransactionStatus } from "../utils/checklistFunctions";

export function useBridgeOutChecklistSetter(
  currentTxType: "Bridge" | "Convert",
  chainId: number,
  bridgeDisabled: boolean,
  convertDisabled: boolean
) {
  //store for transactionchecklist
  const transactionChecklistStore = useTransactionChecklistStore();

  function updateLastBridgeOutChecklist() {
    const currentTx = transactionChecklistStore.getCurrentBridgeOutTx();
    if (currentTx) {
      updateLastBridgeOutTransactionStatus(
        (status, txHash) =>
          transactionChecklistStore.updateCurrentBridgeOutStatus(
            status,
            txHash
          ),
        currentTx,
        currentTxType,
        chainId,
        convertDisabled,
        bridgeDisabled
      );
    }
  }
  useEffect(() => {
    if (!transactionChecklistStore.getCurrentBridgeOutTx()) {
      transactionChecklistStore.addBridgeOutTx();
    }
    updateLastBridgeOutChecklist();
  }, [
    transactionChecklistStore.getCurrentBridgeOutTx()?.currentStep,
    currentTxType,
    convertDisabled,
    bridgeDisabled,
    chainId,
  ]);

  return {
    addTx: transactionChecklistStore.addBridgeOutTx,
    removeTx: transactionChecklistStore.removeBridgeOutTx,
    currentStep:
      transactionChecklistStore.getCurrentBridgeOutTx()?.currentStep ?? 0,
    totalTxs: transactionChecklistStore.bridgeOut.transactions.length,
  };
}

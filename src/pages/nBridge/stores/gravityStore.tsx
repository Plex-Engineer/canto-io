import create from "zustand";
import { devtools } from "zustand/middleware";
import { TransactionState } from "@usedapp/core";
// interface TxStatus {
//   state: TransactionStatus;
//   send: (...args: any[]) => Promise<providers.TransactionReceipt | undefined>;
//   resetState: () => void;
// }

interface BridgeStore {
  transactionType: "Bridge" | "Convert";
  setTransactionType: (value: "Bridge" | "Convert") => void;
  amount: string;
  setAmount: (value: string) => void;
  approveStatus: TransactionState;
  setApproveStatus: (tx: TransactionState) => void;
  cosmosStatus: TransactionState;
  setCosmosStatus: (tx: TransactionState) => void;
}
export const useBridgeStore = create<BridgeStore>()(
  devtools((set) => ({
    transactionType: "Bridge",
    setTransactionType: (value) =>
      set({
        transactionType: value,
      }),
    amount: "",
    setAmount: (value) => set({ amount: value }),
    approveStatus: "None",
    setApproveStatus: (tx) =>
      set({
        approveStatus: tx,
      }),
    cosmosStatus: "None",
    setCosmosStatus: (tx) =>
      set({
        cosmosStatus: tx,
      }),
  }))
);

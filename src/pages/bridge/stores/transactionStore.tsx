import { TransactionState } from "global/config/transactionTypes";
import { BridgeTransactionType } from "../config/interfaces";
import create from "zustand";

interface BridgeTransactionStoreState {
  inTransaction: boolean;
  setInTransaction: (inTransaction: boolean) => void;
  transactionStatus: BridgeTransactionStatus | undefined;
  setTransactionStatus: (status: BridgeTransactionStatus | undefined) => void;
}

export interface BridgeTransactionStatus {
  type: BridgeTransactionType;
  status: TransactionState;
  message: React.ReactNode;
}

const useBridgeTxStore = create<BridgeTransactionStoreState>((set) => ({
  inTransaction: false,
  setInTransaction: (inTransaction) => set({ inTransaction }),
  transactionStatus: undefined,
  setTransactionStatus: (status: BridgeTransactionStatus | undefined) =>
    set({
      transactionStatus: status,
    }),
}));

export default useBridgeTxStore;

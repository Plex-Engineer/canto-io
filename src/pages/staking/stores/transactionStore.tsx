import { TransactionState } from "global/config/transactionTypes";
import React from "react";
import create from "zustand";
import { StakingTransactionType } from "../config/interfaces";

interface StakeTransactionState {
  inTransaction: boolean;
  setInTransaction: (inTransaction: boolean) => void;
  transactionMessage: React.ReactNode;
  setTransactionMessage: (message: React.ReactNode) => void;
  transactionStatus: TransactionStatus | undefined;
  setTransactionStatus: (status: TransactionStatus | undefined) => void;
}

export interface TransactionStatus {
  type: StakingTransactionType;
  status: TransactionState;
  message: React.ReactNode;
}
const useTransactionStore = create<StakeTransactionState>((set) => ({
  inTransaction: false,
  setInTransaction: (inTransaction) => set({ inTransaction }),
  transactionMessage: null,
  setTransactionMessage: (message) => {
    set({ transactionMessage: message });
  },
  transactionStatus: undefined,
  setTransactionStatus: (status: TransactionStatus | undefined) =>
    set({
      transactionStatus: status,
    }),
}));

export default useTransactionStore;

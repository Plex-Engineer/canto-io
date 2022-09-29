import React from "react";
import create from "zustand";

interface TransactionState {
  inTransaction: boolean;
  setInTransaction: (inTransaction: boolean) => void;
  transactionMessage: React.ReactNode;
  setTransactionMessage: (message: React.ReactNode) => void;
}
const useTransactionStore = create<TransactionState>((set) => ({
  inTransaction: false,
  setInTransaction: (inTransaction) => set({ inTransaction }),
  transactionMessage: null,
  setTransactionMessage: (message) => set({ transactionMessage: message }),
}));

export default useTransactionStore;

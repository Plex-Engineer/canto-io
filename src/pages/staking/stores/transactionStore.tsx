import React from "react";
import { toast } from "react-toastify";
import create from "zustand";
import { StakingTransactionType } from "../config/interfaces";

interface TransactionState {
  inTransaction: boolean;
  setInTransaction: (inTransaction: boolean) => void;
  transactionMessage: React.ReactNode;
  setTransactionMessage: (message: React.ReactNode) => void;
  transactionStatus: TransactionStatus | undefined;
  setTransactionStatus: (status: TransactionStatus | undefined) => void;
}

interface TransactionStatus {
  type: StakingTransactionType;
  status: "signing" | "verifying" | "success" | "failure";
  message: React.ReactNode;
}
const useTransactionStore = create<TransactionState>((set) => ({
  inTransaction: false,
  setInTransaction: (inTransaction) => set({ inTransaction }),
  transactionMessage: null,
  setTransactionMessage: (message) => {
    // showToast(message);
    set({ transactionMessage: message });
  },
  transactionStatus: undefined,
  setTransactionStatus: (status: TransactionStatus | undefined) =>
    set({
      transactionStatus: status,
    }),
}));

function showToast(msg: string) {
  toast(msg, {
    position: "top-right",
    autoClose: 4000,

    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progressStyle: {
      color: "var(--primary-color)",
    },
    style: {
      border: "1px solid var(--primary-color)",
      borderRadius: "0px",
      paddingBottom: "3px",
      background: "black",
      color: "var(--primary-color)",
      height: "100px",
      fontSize: "20px",
    },
  });
}

export default useTransactionStore;

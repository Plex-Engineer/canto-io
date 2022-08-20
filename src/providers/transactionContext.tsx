import { TransactionStatus } from "@usedapp/core";
import React from "react";

const TransactionStatusContext = React.createContext<any[] | undefined>([]);
const TransactionStatusUpdateContext = React.createContext<any>([]);
export function useTransactionStatus() {
  return React.useContext(TransactionStatusContext);
}

export function useTransactionStatusUpdate() {
    return React.useContext(TransactionStatusUpdateContext);
  }
export default function TransactionStatusProvider({ children }: any) {
  const [transactionStatus, setTransactionStatus] = React.useState<TransactionStatus[]>();

  function updateTransactionStatus(status: TransactionStatus) {
    setTransactionStatus(transactionStatus);
  }
  return (
    <TransactionStatusContext.Provider value={transactionStatus}>
        <TransactionStatusUpdateContext.Provider value={updateTransactionStatus}>
      {children}
      </TransactionStatusUpdateContext.Provider>
    </TransactionStatusContext.Provider>
  );
}

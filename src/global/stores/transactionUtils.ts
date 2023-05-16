import {
  CantoTransactionType,
  TransactionProps,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "./transactionStore";
import { createTransactionMessges } from "global/utils/utils";

export function createTransactionProps(
  txStore: TransactionStore,
  txType: CantoTransactionType,
  token?: {
    symbol: string;
    icon: string;
    amount: string;
  }
): TransactionProps {
  return {
    txId: txStore.generateTxId(),
    details: {
      type: txType,
      token: token,
    },
    status: "None",
    currentMessage: "Awaiting Signature",
    messages: createTransactionMessges(txType, token?.symbol),
  };
}

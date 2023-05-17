import { TransactionProps } from "global/config/interfaces/transactionTypes";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import create from "zustand";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/transactionChecks";
import { CosmosTxResponse } from "global/config/cosmosConstants";

export interface TransactionStore {
  transactions: TransactionProps[];
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  generateTxId: () => string;
  addTransactions: (transactions: TransactionProps[]) => void;
  updateTx: (txId: string, params: Partial<TransactionProps>) => void;
  performTx: (
    tx: () => Promise<TransactionResponse>,
    txProps: TransactionProps
  ) => Promise<boolean>;
  performCosmosTx: (
    tx: () => Promise<CosmosTxResponse>,
    txProps: TransactionProps
  ) => Promise<boolean>;
}

export const useTransactionStore = create<TransactionStore>()((set, get) => ({
  transactions: [],
  modalOpen: false,
  setModalOpen: (modalOpen) => set({ modalOpen: modalOpen }),
  generateTxId: () => {
    return Math.ceil(
      Math.random() * Math.ceil(Math.random() * Date.now())
    ).toString();
  },
  addTransactions: (transactions) =>
    set({
      transactions: [...transactions],
      modalOpen: true,
    }),
  updateTx: (txId, params) => {
    const index = get().transactions.findIndex((t) => t.txId === txId);
    if (index === -1) {
      throw new Error("tx not found");
    }
    const updatedTx = { ...get().transactions[index], ...params };
    set({
      transactions: [
        ...get().transactions.slice(0, index),
        updatedTx,
        ...get().transactions.slice(index + 1),
      ],
    });
  },
  performTx: async (tx, txProps) => {
    try {
      const transaction = await tx();
      get().updateTx(txProps.txId, {
        status: "Mining",
        currentMessage: txProps.messages.pending,
        hash: transaction.hash,
      });
      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        get().updateTx(txProps.txId, {
          status: "Success",
          currentMessage: txProps.messages.success,
        });
        return true;
      } else {
        get().updateTx(txProps.txId, {
          status: "Fail",
          currentMessage: txProps.messages.error,
        });
        return false;
      }
    } catch (e) {
      get().updateTx(txProps.txId, {
        status: "Fail",
        currentMessage: txProps.messages.error,
        errorReason: (e as Error).message ? (e as Error).message : "",
      });
      return false;
    }
  },
  performCosmosTx: async (tx, txProps) => {
    let transaction;
    try {
      transaction = await tx();
      get().updateTx(txProps.txId, {
        status: "Mining",
        currentMessage: txProps.messages.pending,
        hash: transaction.tx_response.txhash,
      });
      const txSuccess = await checkCosmosTxConfirmation(
        transaction.tx_response.txhash
      );
      if (txSuccess) {
        get().updateTx(txProps.txId, {
          status: "Success",
          currentMessage: txProps.messages.success,
        });
        return true;
      } else {
        get().updateTx(txProps.txId, {
          status: "Fail",
          currentMessage: txProps.messages.error,
        });
        return false;
      }
    } catch (e) {
      get().updateTx(txProps.txId, {
        status: "Fail",
        currentMessage: txProps.messages.error,
        errorReason: (e as Error).message ? (e as Error).message : "",
      });
      return false;
    }
  },
}));

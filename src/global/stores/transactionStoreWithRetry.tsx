import {
  EVMTransaction1,
  EVMTransactionWithStatus,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import create from "zustand";
import { useNetworkInfo } from "./networkInfo";
import { createTransactionDetails } from "./transactionUtils";

export interface TransactionStore {
  transactions: EVMTransactionWithStatus[][];
  txListType: "EVM" | "COSMOS";
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  generateTxId: () => string;
  updateTx: (txId: string, params: Partial<TransactionDetails>) => void;
  performEVMTx: (tx: EVMTransactionWithStatus) => Promise<boolean>;
  performTxList: (
    txList: EVMTransaction1[][],
    listType: "EVM" | "COSMOS"
  ) => Promise<boolean>;
  retryTxs: () => Promise<boolean>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  txListType: "EVM",
  modalOpen: false,
  setModalOpen: (modalOpen) => set({ modalOpen: modalOpen }),
  generateTxId: () =>
    Math.ceil(Math.random() * Math.ceil(Math.random() * Date.now())).toString(),
  updateTx: (txId, params) => {
    const newList = get().transactions;
    for (let i = 0; i < get().transactions.length; i++) {
      const currentGroup = get().transactions[i];
      const index = currentGroup.findIndex((t) => t.details.txId === txId);
      if (index !== -1) {
        newList[i][index] = {
          tx: newList[i][index].tx,
          details: {
            ...newList[i][index].details,
            ...params,
          },
        };
        set({ transactions: newList });
        return;
      }
    }
    //only here if tx is not found
    throw new Error("tx not found");
  },
  performEVMTx: async (tx) => {
    try {
      const contract = useNetworkInfo
        .getState()
        .createContractWithSigner(tx.tx.address, tx.tx.abi);
      const transaction = await contract[tx.tx.method](...tx.tx.params, {
        value: tx.tx.value,
      });
      get().updateTx(tx.details.txId, {
        status: "Mining",
        hash: transaction.hash,
        currentMessage: tx.details.messages.pending,
        blockExplorerLink: "https://tuber.build/tx/" + transaction.hash,
      });
      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        get().updateTx(tx.details.txId, {
          status: "Success",
          currentMessage: tx.details.messages.success,
        });
        return true;
      } else {
        get().updateTx(tx.details.txId, {
          status: "Fail",
          currentMessage: tx.details.messages.error,
        });
        return false;
      }
    } catch (e) {
      get().updateTx(tx.details.txId, {
        status: "Fail",
        currentMessage: tx.details.messages.error,
        errorReason: (e as Error).message ? (e as Error).message : "",
      });
      return false;
    }
  },
  performTxList: async (txList, listType) => {
    const transactionDetails = txList.map((txGroup) => {
      return txGroup.map((tx) => {
        return {
          tx,
          details: createTransactionDetails(get(), tx.txType, tx.extraDetails),
        };
      });
    });
    set({
      transactions: transactionDetails,
      txListType: listType,
      modalOpen: true,
    });
    for (const txGroup of transactionDetails) {
      const txSuccess = await Promise.all(
        txGroup.map(async (tx) =>
          tx.details.status === "Success" ? true : await get().performEVMTx(tx)
        )
      );
      if (!txSuccess.every((tx) => tx)) {
        return false;
      }
    }
    return true;
  },
  retryTxs: async () => {
    return false;
  },
}));

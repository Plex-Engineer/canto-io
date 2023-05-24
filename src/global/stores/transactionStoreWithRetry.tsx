import {
  CosmosTx,
  EVMTx,
  TransactionDetails,
  TransactionWithStatus,
} from "global/config/interfaces/transactionTypes";
import create from "zustand";
import { useNetworkInfo } from "./networkInfo";
import { createTransactionDetails } from "./transactionUtils";

export interface TransactionStore {
  transactions: TransactionWithStatus[];
  txListType: "EVM" | "COSMOS";
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  generateTxId: () => string;
  updateTx: (txId: string, params: Partial<TransactionDetails>) => void;
  performEVMTx: (tx: EVMTx, details?: TransactionDetails) => Promise<boolean>;
  performCosmosTx: (
    tx: CosmosTx,
    details?: TransactionDetails
  ) => Promise<boolean>;
  performTxList: (
    txList: EVMTx[] | CosmosTx[],
    listType: "EVM" | "COSMOS"
  ) => Promise<boolean>;
  retryFrom: (txId: string) => Promise<boolean>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  txListType: "EVM",
  modalOpen: false,
  setModalOpen: (modalOpen) => set({ modalOpen: modalOpen }),
  generateTxId: () =>
    Math.ceil(Math.random() * Math.ceil(Math.random() * Date.now())).toString(),
  updateTx: (txId, params) => {
    const index = get().transactions.findIndex((t) => t.details.txId === txId);
    if (index === -1) {
      throw new Error("tx not found");
    }
    const updatedTx = {
      tx: {
        ...get().transactions[index].tx,
      },
      details: { ...get().transactions[index].details, ...params },
    };
    set({
      transactions: [
        ...get().transactions.slice(0, index),
        updatedTx,
        ...get().transactions.slice(index + 1),
      ],
    });
  },
  performEVMTx: async (tx, details) => {
    try {
      const contract = useNetworkInfo
        .getState()
        .createContractWithSigner(tx.address, tx.abi);
      const transaction = await contract[tx.method](...tx.params, {
        value: tx.value,
      });
      if (details) {
        get().updateTx(details.txId, {
          status: "Mining",
          hash: transaction.hash,
          currentMessage: details.messages.pending,
          blockExplorerLink: "https://tuber.build/tx/" + transaction.hash,
        });
        const receipt = await transaction.wait();
        if (receipt.status === 1) {
          get().updateTx(details.txId, {
            status: "Success",
            currentMessage: details.messages.success,
          });
          return true;
        } else {
          get().updateTx(details.txId, {
            status: "Fail",
            currentMessage: details.messages.error,
          });
          return false;
        }
      }
      return true;
    } catch (e) {
      if (details) {
        get().updateTx(details.txId, {
          status: "Fail",
          currentMessage: details.messages.error,
          errorReason: (e as Error).message ? (e as Error).message : "",
        });
      }
      return false;
    }
  },
  performCosmosTx: async (tx, details) => {},
  performTxList: async (txList, listType) => {
    const txsWithStatus = txList.map((tx) => {
      return {
        tx,
        details: createTransactionDetails(get(), tx.txType, tx.extraDetails),
      };
    });
    set({
      transactions: txsWithStatus,
      txListType: listType,
      modalOpen: true,
    });
    for (const tx of txsWithStatus) {
      const txSuccess =
        listType === "EVM"
          ? await get().performEVMTx(tx.tx as EVMTx, tx.details)
          : await get().performCosmosTx(tx.tx as CosmosTx, tx.details);
      if (!txSuccess) {
        return false;
      }
    }
    return true;
  },
  retryFrom: async (txId) => {
    const index = get().transactions.findIndex((t) => t.details.txId === txId);
    if (index === -1) {
      throw new Error("tx not found");
    }
    for (const tx of get().transactions.slice(index)) {
      const txSuccess =
        get().txListType === "EVM"
          ? await get().performEVMTx(tx.tx as EVMTx, tx.details)
          : await get().performCosmosTx(tx.tx as CosmosTx, tx.details);
      if (!txSuccess) {
        return false;
      }
    }
    return true;
  },
}));

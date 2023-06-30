import {
  CosmosTx,
  EVMTx,
  TransactionDetails,
  TransactionListProps,
  TransactionWithStatus,
} from "global/config/interfaces/transactionTypes";
import create from "zustand";
import { useNetworkInfo } from "./networkInfo";
import { createTransactionDetails } from "./transactionUtils";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/transactionChecks";
import {
  getCantoNetwork,
  getSupportedNetwork,
} from "global/utils/getAddressUtils";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";

export enum TxMethod {
  NONE,
  EVM,
  COSMOS,
}
export interface TransactionStore {
  transactions: TransactionWithStatus[];
  txListProps: TransactionListProps | null;
  modalOpen: boolean;
  addTransactionList: (
    txList: EVMTx[] | CosmosTx[],
    txListProps: TransactionListProps,
    perform?: boolean
  ) => Promise<boolean>;
  setModalOpen: (modalOpen: boolean) => void;
  generateTxId: () => string;
  updateTx: (txId: string, params: Partial<TransactionDetails>) => void;
  performEVMTx: (tx: EVMTx, details?: TransactionDetails) => Promise<boolean>;
  performCosmosTx: (
    tx: CosmosTx,
    details?: TransactionDetails
  ) => Promise<boolean>;
  //if txId is passed in, it will begin from this transaction
  //used in retrying after failure
  performTxList: (txId?: string) => Promise<boolean>;
  //will keep track of txList parameters and waiting for txs to load
  status: {
    loading: boolean;
    error?: string;
  };
  setStatus: (status: { error?: string; loading?: boolean }) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  txListProps: null,
  modalOpen: false,
  addTransactionList: async (txList, txListProps, perform = true) => {
    set({
      transactions: txList.map((tx) => ({
        tx,
        details: createTransactionDetails(
          get().generateTxId(),
          tx.txType,
          tx.extraDetails
        ),
      })),
      txListProps: txListProps,
    });
    //on adding txs, we will go ahead and start performing them as well if on the correct network
    return perform ? await get().performTxList() : true;
  },
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
    if (tx.mustPerform === false) {
      if (details)
        get().updateTx(details.txId, {
          status: "Success",
          currentMessage: details.messages.success,
        });
      return true;
    }
    try {
      const contract = useNetworkInfo
        .getState()
        .createContractWithSigner(tx.address, tx.abi);
      const allParams = await Promise.all(
        tx.params.map(async (p) => (p instanceof Function ? await p() : p))
      );
      const transaction = await contract[tx.method](...allParams, {
        value: tx.value instanceof Function ? await tx.value() : tx.value,
      });
      if (details) {
        get().updateTx(details.txId, {
          status: "Mining",
          hash: transaction.hash,
          currentMessage: details.messages.pending,
          blockExplorerLink:
            getSupportedNetwork(tx.chainId).blockExplorerUrl +
            "/tx/" +
            transaction.hash,
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
          errorReason: (e as Error).message ?? "",
        });
      }
      return false;
    }
  },
  performCosmosTx: async (tx, details) => {
    if (tx.mustPerform === false) {
      if (details)
        get().updateTx(details.txId, {
          status: "Success",
          currentMessage: details.messages.success,
        });
      return true;
    }
    let txReceipt;
    try {
      txReceipt = await tx.tx(...tx.params);
      if (details) {
        get().updateTx(details.txId, {
          status: "Mining",
          currentMessage: details.messages.pending,
          hash: txReceipt.tx_response.txhash,
          blockExplorerLink:
            getCantoNetwork(tx.chainId).cosmosBlockExplorerUrl +
            "/txs/" +
            txReceipt.tx_response.txhash,
        });
        const txSuccess = await checkCosmosTxConfirmation(
          txReceipt.tx_response.txhash,
          tx.chainId
        );
        if (txSuccess) {
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
          errorReason: (e as Error).message ?? "",
        });
      }
      return false;
    }
  },
  performTxList: async (txId) => {
    get().setStatus({ loading: false });
    //check to make sure user is on the right network
    if (
      Number(useNetworkInfo.getState().chainId) !== get().txListProps?.chainId
    ) {
      const didSwitch = await switchNetwork(
        get().txListProps?.chainId as number
      );
      if (!didSwitch) {
        return false;
      }
    }
    //if no txId is passed in, index will be -1, so we will start from the beginning
    const index = get().transactions.findIndex((t) => t.details.txId === txId);
    let txsToPerform;
    if (index === -1) {
      txsToPerform = get().transactions;
    } else {
      txsToPerform = get().transactions.slice(index);
    }
    for (const tx of txsToPerform) {
      const txSuccess =
        get().txListProps?.txListMethod === TxMethod.EVM
          ? await get().performEVMTx(tx.tx as EVMTx, tx.details)
          : await get().performCosmosTx(tx.tx as CosmosTx, tx.details);
      if (!txSuccess) {
        return false;
      }
    }
    return true;
  },
  status: {
    loading: false,
  },
  setStatus: (status) => {
    set({
      status: {
        loading: status.loading ?? false,
        error: status.error ?? undefined,
      },
      modalOpen: true,
    });
  },
}));

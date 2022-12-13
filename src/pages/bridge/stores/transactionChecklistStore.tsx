import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface BridgeInTransactionChecklistStatus {
  currentStep: BridgeInStatus;
  txHash: string | undefined;
}
export interface BridgeOutTransactionChecklistStatus {
  currentStep: BridgeOutStatus;
  txHash: string | undefined;
}

interface LastTransactionProps {
  lastTxTime: number;
  lastAccount: string | undefined;
  setLastAccount: (account: string | undefined) => void;
  checkPreviousAccount: (account: string | undefined) => void;
  //bridge in
  bridgeIn: {
    transactions: BridgeInTransactionChecklistStatus[];
  };
  updateCurrentBridgeInStatus: (
    status: BridgeInStatus,
    txHash: string | undefined
  ) => void;
  addBridgeInTx: (tx: BridgeInTransactionChecklistStatus) => void;
  removeBridgeInTx: () => void;
  getCurrentBridgeInTx: () => BridgeInTransactionChecklistStatus | undefined;
  //bridge out
  bridgeOut: {
    transactions: BridgeOutTransactionChecklistStatus[];
  };
  updateCurrentBridgeOutStatus: (
    status: BridgeOutStatus,
    txHash: string | undefined
  ) => void;
  addBridgeOutTx: (tx: BridgeOutTransactionChecklistStatus) => void;
  removeBridgeOutTx: () => void;
  getCurrentBridgeOutTx: () => BridgeOutTransactionChecklistStatus | undefined;
  resetState: () => void;
}

export enum BridgeInStatus {
  SELECT_ETH,
  SWTICH_TO_ETH,
  SELECT_ERC20_TOKEN,
  SEND_FUNDS_TO_GBRIDGE,
  WAIT_FOR_GRBIDGE,
  SELECT_CONVERT,
  SWITCH_TO_CANTO,
  SELECT_NATIVE_TOKEN,
  CONVERT,
  COMPLETE,
}
export enum BridgeOutStatus {
  SELECT_CONVERT,
  SWITCH_TO_CANTO,
  SELECT_CONVERT_TOKEN,
  CONVERT_COIN,
  SELECT_BRIDGE,
  SELECT_NATIVE_TOKEN,
  SEND_TO_GRBIDGE,
  COMPLETE,
}

export const useTransactionChecklistStore = create<LastTransactionProps>()(
  devtools(
    persist((set, get) => ({
      lastTxTime: 0,
      lastAccount: undefined,
      setLastAccount: (account) => {
        set({ lastAccount: account });
      },
      checkPreviousAccount: (account) => {
        //if more than 2 hours, reset the checklist
        if (get().lastTxTime + 3600000 < new Date().getTime()) {
          get().resetState();
        }
        if (account != undefined) {
          if (account != get().lastAccount) {
            get().resetState();
          }
          set({ lastAccount: account });
        }
      },
      bridgeIn: {
        transactions: [],
      },
      updateCurrentBridgeInStatus: (status, txHash) => {
        const txList = get().bridgeIn.transactions;
        txList[txList.length - 1].currentStep = status;
        if (txHash) {
          txList[txList.length - 1].txHash = txHash;
        }
        set({
          bridgeIn: { transactions: txList },
          lastTxTime: new Date().getTime(),
        });
      },
      addBridgeInTx: (tx) => {
        const newTxList = get().bridgeIn.transactions;
        newTxList.push(tx);
        set({
          bridgeIn: {
            transactions: newTxList,
          },
          lastTxTime: new Date().getTime(),
        });
      },
      removeBridgeInTx: () => {
        const newTxList = get().bridgeIn.transactions;
        newTxList.pop();
        set({
          bridgeIn: {
            transactions: newTxList,
          },
          lastTxTime: new Date().getTime(),
        });
      },
      getCurrentBridgeInTx: () => {
        const currentTxLength = get().bridgeIn.transactions.length;
        return currentTxLength == 0
          ? undefined
          : get().bridgeIn.transactions[currentTxLength - 1];
      },
      bridgeOut: {
        transactions: [],
      },
      updateCurrentBridgeOutStatus: (status, txHash) => {
        const txList = get().bridgeOut.transactions;
        txList[txList.length - 1].currentStep = status;
        if (txHash) {
          txList[txList.length - 1].txHash = txHash;
        }
        set({
          bridgeOut: { transactions: txList },
          lastTxTime: new Date().getTime(),
        });
      },
      addBridgeOutTx: (tx) => {
        const newTxList = get().bridgeOut.transactions;
        newTxList.push(tx);
        set({
          bridgeOut: {
            transactions: newTxList,
          },
          lastTxTime: new Date().getTime(),
        });
      },
      removeBridgeOutTx: () => {
        const newTxList = get().bridgeOut.transactions;
        newTxList.pop();
        set({
          bridgeOut: {
            transactions: newTxList,
          },
          lastTxTime: new Date().getTime(),
        });
      },
      getCurrentBridgeOutTx: () => {
        const currentTxLength = get().bridgeOut.transactions.length;
        return currentTxLength == 0
          ? undefined
          : get().bridgeOut.transactions[currentTxLength - 1];
      },
      resetState: () => {
        set({
          bridgeIn: { transactions: [] },
          bridgeOut: { transactions: [] },
          lastAccount: undefined,
        });
      },
    }))
  )
);

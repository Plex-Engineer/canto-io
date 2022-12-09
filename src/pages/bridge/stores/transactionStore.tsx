import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { EventWithTime, PendingEvent } from "../utils/utils";
interface AllTransactions {
  pendingBridgeTransactions: PendingEvent[];
  completedBridgeTransactions: EventWithTime[];
  bridgeOutTransactions: unknown[];
}
interface TransactionStore {
  account: string;
  checkAccount: (account: string | undefined) => void;
  newTransactions: number;
  setNewTransactions: (value: number) => void;
  oldTransactionLength: number;
  transactions: AllTransactions;
  setTransactions: (
    account: string | undefined,
    pendingBridgeTransactions: PendingEvent[],
    completedBridgeTransactions: EventWithTime[],
    bridgeOutTransactions: unknown[]
  ) => void;
}

export const useBridgeTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => ({
        account: "",
        //checking to make sure account is the same as persisted so we don't show wrong transactions for new account
        checkAccount: (account) => {
          if (account != get().account && account) {
            set({
              newTransactions: 0,
              oldTransactionLength: 0,
              transactions: {
                pendingBridgeTransactions: [],
                completedBridgeTransactions: [],
                bridgeOutTransactions: [],
              },
            });
          }
        },
        newTransactions: 0,
        setNewTransactions: (value) => set({ newTransactions: value }),
        transactions: {
          pendingBridgeTransactions: [],
          completedBridgeTransactions: [],
          bridgeOutTransactions: [],
        },
        oldTransactionLength: 0,
        setTransactions: (
          account: string | undefined,
          pendingBridgeTransactions: PendingEvent[],
          completedBridgeTransactions: EventWithTime[],
          bridgeOutTransactions: unknown[]
        ) => {
          //checking for new transactions
          //if previous length is not 0, then there are previous transactions
          const newLength =
            pendingBridgeTransactions.length +
            completedBridgeTransactions.length +
            bridgeOutTransactions.length;
          //if there is a new account, then new transactions cannot happen
          if (account === get().account && get().oldTransactionLength != 0) {
            const newTxLength = newLength - get().oldTransactionLength;
            //must check if there are already new transactions, so we do not delete them
            set({
              newTransactions: newTxLength + get().newTransactions,
            });
          }
          //setting relevant info
          set({
            transactions: {
              pendingBridgeTransactions: pendingBridgeTransactions,
              completedBridgeTransactions: completedBridgeTransactions,
              bridgeOutTransactions: bridgeOutTransactions,
            },
            account: account,
            oldTransactionLength: newLength,
          });
        },
      }),
      {
        name: "transaction-store",
        getStorage: () => localStorage,
        //we can't save all of the transactions to local storage (not enough space for this)
        //only save information on lengths and last account we used
        partialize: (state) => ({
          account: state.account,
          newTransactions: state.newTransactions,
          oldTransactionLength: state.oldTransactionLength,
        }),
      }
    )
  )
);

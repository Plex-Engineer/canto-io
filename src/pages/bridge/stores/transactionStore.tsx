import { Event } from "ethers";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { EventWithTime } from "../utils/utils";
interface AllTransactions {
  pendingBridgeTransactions: Event[];
  completedBridgeTransactions: EventWithTime[];
  bridgeOutTransactions: any[];
}
interface TransactionStore {
  account: string;
  checkAccount: (account: string | undefined) => void;
  newTransactions: number;
  setNewTransactions: (value: number) => void;
  transactions: AllTransactions;
  setTransactions: (
    account: string | undefined,
    pendingBridgeTransactions: Event[],
    completedBridgeTransactions: EventWithTime[],
    bridgeOutTransactions: any[]
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
        setTransactions: (
          account: string | undefined,
          pendingBridgeTransactions: Event[],
          completedBridgeTransactions: EventWithTime[],
          bridgeOutTransactions: any[]
        ) => {
          //checking for new transactions
          //if there is a new account, then new transactions cannot happen
          if (account === get().account) {
            const prevLength =
              get().transactions.completedBridgeTransactions.length +
              get().transactions.bridgeOutTransactions.length +
              get().transactions.pendingBridgeTransactions.length;
            //if previous length is not 0, then there are previous transactions
            if (prevLength != 0) {
              const newLength =
                pendingBridgeTransactions.length +
                completedBridgeTransactions.length +
                bridgeOutTransactions.length;
              const newTxLength = newLength - prevLength;
              //must check if there are already new transactions, so we do not delete them
              if (
                get().newTransactions === 0 ||
                newTxLength > get().newTransactions
              ) {
                set({ newTransactions: newLength - prevLength });
              }
            }
          }
          //setting relevant info
          set({
            transactions: {
              pendingBridgeTransactions: pendingBridgeTransactions,
              completedBridgeTransactions: completedBridgeTransactions,
              bridgeOutTransactions: bridgeOutTransactions,
            },
            account: account,
          });
        },
      }),
      {
        name: "transaction-store",
        getStorage: () => localStorage,
      }
    )
  )
);

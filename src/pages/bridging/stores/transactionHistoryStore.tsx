import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TransactionStore {
  account: string;
  checkAccount: (account: string | undefined) => void;
  setNewTransactions: (value: number, account: string | undefined) => void;
  newTransactionLength: number;
  oldTransactionLength: number;
}

export const useBridgeTransactionPageStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => ({
        account: "",
        //checking to make sure account is the same as persisted so we don't show wrong transactions for new account
        checkAccount: (account) => {
          if (account != get().account && account) {
            set({
              newTransactionLength: 0,
              oldTransactionLength: 0,
            });
          }
        },
        oldTransactionLength: 0,
        newTransactionLength: 0,
        setNewTransactions: (value, account) => {
          if (account != get().account && account) {
            set({
              newTransactionLength: 0,
              oldTransactionLength: 0,
            });
          }
          if (account) {
            const newTransactions = value - get().oldTransactionLength;
            if (newTransactions >= 0) {
              if (get().oldTransactionLength != 0) {
                set({
                  newTransactionLength: newTransactions,
                });
              }
              set({ oldTransactionLength: value });
            }
          }
        },
      }),
      {
        name: "bridge-history-store",
      }
    )
  )
);

import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export enum SelectedTokens {
  ETHTOKEN,
  CONVERTOUT,
}
export interface TokenStore {
  selectedTokens: {
    [SelectedTokens.ETHTOKEN]: string;
    [SelectedTokens.CONVERTOUT]: string;
  };
  setSelectedToken: (
    tokenAddress: string,
    selectedFrom: SelectedTokens
  ) => void;
  lastTokenSelect: number;
  checkTimeAndResetTokens: () => void;
}
export const useBridgeTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedTokens: {
          [SelectedTokens.ETHTOKEN]: "",
          [SelectedTokens.CONVERTOUT]: "",
        },
        setSelectedToken: (tokenAddress, selectedFrom) => {
          set({
            lastTokenSelect: new Date().getTime(),
            selectedTokens: {
              ...get().selectedTokens,
              [selectedFrom]: tokenAddress,
            },
          });
        },
        lastTokenSelect: 0,
        checkTimeAndResetTokens: () => {
          //if it has been less than 1 minute, we can keep the selected tokens, since the user is just refreshing
          if (get().lastTokenSelect + 60000 < new Date().getTime()) {
            set({
              selectedTokens: {
                [SelectedTokens.ETHTOKEN]: "",
                [SelectedTokens.CONVERTOUT]: "",
              },
            });
          }
        },
      }),
      {
        name: "bridge-token-store",
        // getStorage: () => localStorage,
        serialize: (state) => JSON.stringify(state),
      }
    )
  )
);

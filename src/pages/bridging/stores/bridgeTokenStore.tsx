import { BigNumber } from "ethers";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  EMPTY_ERC20_BRIDGE_TOKEN,
  UserERC20BridgeToken,
} from "../config/interfaces";

export enum SelectedTokens {
  ETHTOKEN,
  CONVERTOUT,
}
export interface TokenStore {
  selectedTokens: {
    [SelectedTokens.ETHTOKEN]: UserERC20BridgeToken;
    [SelectedTokens.CONVERTOUT]: UserERC20BridgeToken;
  };
  setSelectedToken: (
    token: UserERC20BridgeToken,
    selectedFrom: SelectedTokens
  ) => void;
  //used to refresh the selected token, since token info could change between blocks
  resetSelectedToken: (
    tokenType: SelectedTokens,
    tokenList: UserERC20BridgeToken[]
  ) => void;
  lastTokenSelect: number;
  checkTimeAndResetTokens: () => void;
}
export const useBridgeTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedTokens: {
          [SelectedTokens.ETHTOKEN]: EMPTY_ERC20_BRIDGE_TOKEN,
          [SelectedTokens.CONVERTOUT]: EMPTY_ERC20_BRIDGE_TOKEN,
        },
        setSelectedToken: (
          token: UserERC20BridgeToken,
          selectedFrom: SelectedTokens
        ) => {
          set({
            lastTokenSelect: new Date().getTime(),
            selectedTokens: {
              ...get().selectedTokens,
              [selectedFrom]: token,
            },
          });
        },
        resetSelectedToken: (tokenType, tokenList) => {
          get().setSelectedToken(
            tokenList.find(
              (t) => t.address === get().selectedTokens[tokenType].address
            ) ?? get().selectedTokens[tokenType],
            tokenType
          );
        },
        lastTokenSelect: 0,
        checkTimeAndResetTokens: () => {
          //if it has been less than 1 minute, we can keep the selected tokens, since the user is just refreshing
          if (get().lastTokenSelect + 60000 < new Date().getTime()) {
            set({
              selectedTokens: {
                [SelectedTokens.ETHTOKEN]: EMPTY_ERC20_BRIDGE_TOKEN,
                [SelectedTokens.CONVERTOUT]: EMPTY_ERC20_BRIDGE_TOKEN,
              },
            });
          }
        },
      }),
      {
        name: "bridge-token-store",
        // getStorage: () => localStorage,
        serialize: (state) => JSON.stringify(state),
        //need to deserialize to get BigNumbers back
        deserialize: (state) => {
          const parsedState = JSON.parse(state);
          const selectedTokens = parsedState?.state?.selectedTokens;
          if (selectedTokens) {
            selectedTokens[SelectedTokens.ETHTOKEN].allowance = BigNumber.from(
              selectedTokens[SelectedTokens.ETHTOKEN].allowance?.hex ?? 0
            );
            selectedTokens[SelectedTokens.ETHTOKEN].erc20Balance =
              BigNumber.from(
                selectedTokens[SelectedTokens.ETHTOKEN].erc20Balance?.hex ?? 0
              );
            selectedTokens[SelectedTokens.CONVERTOUT].allowance =
              BigNumber.from(
                selectedTokens[SelectedTokens.CONVERTOUT].allowance?.hex ?? 0
              );
            selectedTokens[SelectedTokens.CONVERTOUT].erc20Balance =
              BigNumber.from(
                selectedTokens[SelectedTokens.CONVERTOUT].erc20Balance?.hex ?? 0
              );
          }
          return {
            ...parsedState,
            selectedTokens: selectedTokens,
          };
        },
      }
    )
  )
);

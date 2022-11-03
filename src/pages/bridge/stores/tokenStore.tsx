import { BigNumber } from "ethers";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  BaseToken,
  EmptySelectedConvertToken,
  EmptySelectedETHToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "../config/interfaces";

export enum SelectedTokens {
  ETHTOKEN,
  CONVERTIN,
  CONVERTOUT,
  BRIDGEOUT,
}
interface TokenStore {
  selectedTokens: {
    [SelectedTokens.ETHTOKEN]: UserGravityBridgeTokens;
    [SelectedTokens.CONVERTIN]: UserConvertToken;
    [SelectedTokens.CONVERTOUT]: UserConvertToken;
    [SelectedTokens.BRIDGEOUT]: UserNativeTokens;
  };
  setSelectedToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
  //used to refresh the selected token, since token info could change between blocks
  resetSelectedToken: (
    tokenType: SelectedTokens,
    tokenList: BaseToken[]
  ) => void;
  lastTokenSelect: number;
  checkTimeAndResetTokens: () => void;
}
export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedTokens: {
          [SelectedTokens.ETHTOKEN]: EmptySelectedETHToken,
          [SelectedTokens.CONVERTIN]: EmptySelectedConvertToken,
          [SelectedTokens.CONVERTOUT]: EmptySelectedConvertToken,
          [SelectedTokens.BRIDGEOUT]: EmptySelectedNativeToken,
        },
        setSelectedToken: (token: BaseToken, selectedFrom: SelectedTokens) => {
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
                [SelectedTokens.ETHTOKEN]: EmptySelectedETHToken,
                [SelectedTokens.CONVERTIN]: EmptySelectedConvertToken,
                [SelectedTokens.CONVERTOUT]: EmptySelectedConvertToken,
                [SelectedTokens.BRIDGEOUT]: EmptySelectedNativeToken,
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
            selectedTokens[0].allowance = BigNumber.from(
              selectedTokens[0].allowance?.hex ?? 0
            );
            selectedTokens[0].balanceOf = BigNumber.from(
              selectedTokens[0].balanceOf?.hex ?? 0
            );
            for (let i = 1; i < 4; i++) {
              selectedTokens[i].nativeBalance = BigNumber.from(
                selectedTokens[i]?.nativeBalance ?? 0
              );
              selectedTokens[i].erc20Balance = BigNumber.from(
                selectedTokens[i]?.erc20Balance ?? 0
              );
            }
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

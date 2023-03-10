import { BigNumber } from "ethers";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  BaseToken,
  BridgeOutNetworks,
  EMPTY_BRIDGE_IN_TOKEN,
  EMPTY_BRIDGE_OUT_TOKEN,
  EMPTY_CONVERT_TOKEN,
  UserBridgeInToken,
  UserConvertToken,
  UserNativeToken,
} from "../config/interfaces";

export enum SelectedTokens {
  ETHTOKEN,
  CONVERTIN,
  CONVERTOUT,
  BRIDGEOUT,
}
export interface TokenStore {
  selectedTokens: {
    [SelectedTokens.ETHTOKEN]: UserBridgeInToken;
    [SelectedTokens.CONVERTIN]: UserConvertToken;
    [SelectedTokens.CONVERTOUT]: UserConvertToken;
    [SelectedTokens.BRIDGEOUT]: UserNativeToken;
  };
  setSelectedToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
  //used to refresh the selected token, since token info could change between blocks
  resetSelectedToken: (
    tokenType: SelectedTokens,
    tokenList: BaseToken[]
  ) => void;
  lastTokenSelect: number;
  checkTimeAndResetTokens: () => void;
  bridgeOutNetwork: BridgeOutNetworks;
  setBridgeOutNetwork: (network: BridgeOutNetworks) => void;
}
export const useBridgeTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedTokens: {
          [SelectedTokens.ETHTOKEN]: EMPTY_BRIDGE_IN_TOKEN,
          [SelectedTokens.CONVERTIN]: EMPTY_CONVERT_TOKEN,
          [SelectedTokens.CONVERTOUT]: EMPTY_CONVERT_TOKEN,
          [SelectedTokens.BRIDGEOUT]: EMPTY_BRIDGE_OUT_TOKEN,
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
                [SelectedTokens.ETHTOKEN]: EMPTY_BRIDGE_IN_TOKEN,
                [SelectedTokens.CONVERTIN]: EMPTY_CONVERT_TOKEN,
                [SelectedTokens.CONVERTOUT]: EMPTY_CONVERT_TOKEN,
                [SelectedTokens.BRIDGEOUT]: EMPTY_BRIDGE_OUT_TOKEN,
              },
            });
          }
        },
        bridgeOutNetwork: BridgeOutNetworks.GRAVITY_BRIDGE,
        setBridgeOutNetwork: (network: BridgeOutNetworks) => {
          get().setSelectedToken(
            EMPTY_BRIDGE_OUT_TOKEN,
            SelectedTokens.BRIDGEOUT
          );
          set({ bridgeOutNetwork: network });
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

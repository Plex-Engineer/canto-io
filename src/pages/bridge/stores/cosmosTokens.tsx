import create from "zustand";
import { devtools } from "zustand/middleware";
import {
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
  setSelectedToken: (token: any, selectedFrom: SelectedTokens) => void;
}
export const useTokenStore = create<TokenStore>()(
  devtools((set, get) => ({
    selectedTokens: {
      [SelectedTokens.ETHTOKEN]: EmptySelectedETHToken,
      [SelectedTokens.CONVERTIN]: EmptySelectedConvertToken,
      [SelectedTokens.CONVERTOUT]: EmptySelectedConvertToken,
      [SelectedTokens.BRIDGEOUT]: EmptySelectedNativeToken,
    },
    setSelectedToken: (token: any, selectedFrom: SelectedTokens) => {
      set({
        selectedTokens: {
          ...get().selectedTokens,
          [selectedFrom]: token,
        },
      });
    },
  }))
);

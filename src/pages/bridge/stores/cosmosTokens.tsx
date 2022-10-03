import create from "zustand";
import { devtools } from "zustand/middleware";
import { emptySelectedToken, UserNativeGTokens } from "../config/interfaces";

interface TokenStore {
  tokens: UserNativeGTokens[];
  setTokens: (tokens: UserNativeGTokens[]) => void;
  selectedToken: UserNativeGTokens;
  setSelectedToken: (token: UserNativeGTokens) => void;
}
export const useTokenStore = create<TokenStore>()(
  devtools((set) => ({
    tokens: [],
    setTokens: (tokens: UserNativeGTokens[]) => set({ tokens: tokens }),
    selectedToken: emptySelectedToken,
    setSelectedToken: (token: UserNativeGTokens) => {
      set({
        selectedToken: token,
      });
    },
  }))
);

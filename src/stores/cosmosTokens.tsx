import create from "zustand";
import { devtools } from "zustand/middleware";
import emptyToken from "assets/empty.svg";

export interface CantoToken {
    name : string, // native canonical name
    wName : string, // ERC20 canonical name
    icon : null,
    value: string,
    nativeName : string, // mapping to the actual native token name,
    decimals : number
}

interface TokenStore {
  tokens: CantoToken[];
  setTokens: (tokens: CantoToken[]) => void;
  selectedToken: CantoToken;
  setSelectedToken: (token: CantoToken) => void;
}
export const useTokenStore = create<TokenStore>()(
  devtools((set) => ({
    tokens: [],
    setTokens: (tokens: CantoToken[]) => set({ tokens: tokens }),
    selectedToken: {
        name : "select native coin", // native canonical name
        wName : "select erc20 token", // ERC20 canonical name
        icon : null,
        value: "0",
        nativeName : 'erc20/', // mapping to the actual native token name,
        decimals : 18
    },
    setSelectedToken: (token: CantoToken) => {
      set({
        selectedToken: token,
      });
    },
  }
  ))
);
import { devtools, persist } from "zustand/middleware";
import create from "zustand";
import { Token, TOKENS } from "global/config/tokenInfo";

interface BridgeWalkthroughStoreProps {
  BridgeType: "IN" | "OUT" | "NONE";
  BridgeStep: "FIRST" | "LAST" | "NONE";
  SelectedToken: Token | "NONE";
  Amount: string;
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  setBridgeStep: (step: "FIRST" | "LAST" | "NONE") => void;
  setSelectedToken: (token: Token) => void;
  setAmount: (amount: string) => void;
  reset: () => void;
}

const BridgeFlow = {
  bridge: {
    in: ["network", "select", "amount", "approval", "confirmation"],
  },
};
export const useBridgeWalkthroughStore = create<BridgeWalkthroughStoreProps>()(
  persist((set, get) => ({
    BridgeType: "NONE",
    BridgeStep: "NONE",
    SelectedToken: "NONE",
    Amount: "",
    setBridgeType: (type) => set({ BridgeType: type }),
    setBridgeStep: (step) => set({ BridgeStep: step }),
    setAmount: (amount) => set({ Amount: amount }),
    setSelectedToken: (token) => set({ SelectedToken: token }),
    reset: () =>
      set({
        BridgeType: "NONE",
        BridgeStep: "NONE",
        Amount: "",
        SelectedToken: "NONE",
      }),
  }))
);

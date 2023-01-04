import { persist } from "zustand/middleware";
import create from "zustand";
import { Token } from "global/config/tokenInfo";

export enum BridgeStep {
  CHOICE,
  SWITCH_NETWORK,
  CHOOSE_TOKEN,
  CHOOSE_AMOUNT,
  APPROVAL,
  CONFIRMATION,
  PROCESSING,
  SUCCESSFUL,
}

interface Props {
  BridgeType: "IN" | "OUT" | "NONE";
  BridgeStep: "FIRST" | "LAST" | "NONE";
  SelectedToken: Token | "NONE";
  Amount: string;
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  setBridgeStep: (step: "FIRST" | "LAST" | "NONE") => void;
  setSelectedToken: (token: Token) => void;
  setAmount: (amount: string) => void;
  currentStep: BridgeStep;
  stepTracker: BridgeStep[];
  setCurrentStep: (step: BridgeStep) => void;
  pushStepTracker: (step: BridgeStep) => void;
  popStepTracker: () => BridgeStep | undefined;
  reset: () => void;
}

export const useBridgeWalkthroughStore = create<Props>()((set, get) => ({
  BridgeType: "NONE",
  BridgeStep: "NONE",
  SelectedToken: "NONE",
  Amount: "",
  setBridgeType: (type) => set({ BridgeType: type }),
  setBridgeStep: (step) => set({ BridgeStep: step }),
  setAmount: (amount) => set({ Amount: amount }),
  setSelectedToken: (token) => set({ SelectedToken: token }),
  currentStep: BridgeStep.CHOICE,
  setCurrentStep: (step) => set({ currentStep: step }),
  pushStepTracker: (step) =>
    set({ stepTracker: [...get().stepTracker, step], currentStep: step }),
  popStepTracker: () => {
    const pop = get().stepTracker.pop();
    set({
      stepTracker: [...get().stepTracker],
      currentStep: get().stepTracker[get().stepTracker.length - 1],
    });
    return pop;
  },
  stepTracker: [BridgeStep.CHOICE],
  reset: () =>
    set({
      BridgeType: "NONE",
      BridgeStep: "NONE",
      Amount: "",
      SelectedToken: "NONE",
    }),
}));

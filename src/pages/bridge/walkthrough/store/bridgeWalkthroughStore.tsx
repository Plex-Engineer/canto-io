import create from "zustand";
import {
  BridgeInStep,
  BridgeInWalkthroughSteps,
  BridgeOutStep,
  BridgeOutWalkthroughSteps,
} from "../walkthroughTracker";

interface BridgeWalkthroughStoreProps {
  currentBridgeType: "IN" | "OUT" | "NONE";
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  userSkip: boolean;
  setUserSkip: (skip: boolean) => void;
  bridgeInStep: BridgeInStep;
  setBridgeInStep: (step: BridgeInStep) => void;
  bridgeOutStep: BridgeOutStep;
  setBridgeOutStep: (step: BridgeOutStep) => void;
  nextStep: (bridgeIn: boolean) => void;
  previousStep: (bridgeIn: boolean) => void;
  resetState: (bridgeIn: boolean) => void;
}
export const useBridgeWalkthroughStore = create<BridgeWalkthroughStoreProps>()(
  (set, get) => ({
    currentBridgeType: "NONE",
    setBridgeType: (type) => set({ currentBridgeType: type }),
    userSkip: false,
    setUserSkip: (skip) => set({ userSkip: skip }),
    bridgeInStep: 0,
    setBridgeInStep: (step) => set({ bridgeInStep: step }),
    bridgeOutStep: 0,
    setBridgeOutStep: (step) => set({ bridgeOutStep: step }),
    nextStep: (bridgeIn) => {
      if (bridgeIn) {
        set({
          bridgeInStep: BridgeInWalkthroughSteps[get().bridgeInStep].next,
        });
      } else {
        set({
          bridgeOutStep: BridgeOutWalkthroughSteps[get().bridgeOutStep].next,
        });
      }
    },
    previousStep(bridgeIn) {
      if (bridgeIn) {
        set({
          bridgeInStep: BridgeInWalkthroughSteps[get().bridgeInStep].prev,
        });
      } else {
        set({
          bridgeOutStep: BridgeOutWalkthroughSteps[get().bridgeOutStep].prev,
        });
      }
    },
    resetState: (bridgeIn: boolean) => {
      if (bridgeIn) {
        set({ bridgeInStep: 0 });
      } else {
        set({ bridgeOutStep: 0 });
      }
    },
  })
);

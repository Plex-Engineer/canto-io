import { BaseToken } from "pages/bridge/config/interfaces";
import { devtools, persist } from "zustand/middleware";
import create from "zustand";
import { BridgeInStep, BridgeOutStep } from "../walkthroughTracker";

interface BridgeWalkthroughStoreProps {
  bridgeInStep: BridgeInStep;
  bridgeOutStep: BridgeOutStep;
  setBridgeInStep: (step: BridgeInStep) => void;
  setBridgeOutStep: (step: BridgeOutStep) => void;
  nextStep: (bridgeIn: boolean) => void;
  previousStep: (bridgeIn: boolean) => void;
  resetState: (bridgeIn: boolean) => void;
}
export const useBridgeWalkthroughStore = create<BridgeWalkthroughStoreProps>()(
  devtools(
    persist((set, get) => ({
      bridgeInStep: 0,
      bridgeOutStep: 0,
      setBridgeInStep: (step) => set({ bridgeInStep: step }),
      setBridgeOutStep: (step) => set({ bridgeOutStep: step }),
      nextStep: (bridgeIn) => {
        if (bridgeIn) {
          set({
            bridgeInStep: get().bridgeInStep + 1,
          });
        } else {
          set({
            bridgeOutStep: get().bridgeOutStep + 1,
          });
        }
      },
      previousStep(bridgeIn) {
        if (bridgeIn) {
          set({
            bridgeInStep: get().bridgeInStep - 1,
          });
        } else {
          set({
            bridgeOutStep: get().bridgeOutStep - 1,
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
    }))
  )
);

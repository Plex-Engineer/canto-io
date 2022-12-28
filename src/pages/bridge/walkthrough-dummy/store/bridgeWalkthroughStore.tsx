import { devtools, persist } from "zustand/middleware";
import create from "zustand";
import {
  BridgeInStep,
  BridgeInWalkthroughSteps,
  BridgeOutStep,
  BridgeOutWalkthroughSteps,
} from "../walkthroughTracker";

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
    }))
  )
);

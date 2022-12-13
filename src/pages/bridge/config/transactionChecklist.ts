import { CantoMainnet } from "global/config/networks";
import { ETHMainnet } from "./networks";
import {
  BridgeInStatus,
  BridgeOutStatus,
} from "../stores/transactionChecklistStore";
import { EventWithTime } from "../utils/utils";

export interface ChecklistTracker {
  [key: number]: ChecklistInfo;
}
//@next is the next step to go to if the checkFunction returns true
//@isCheckpoint is true if the step is a checkpoint, meaning that the user can go back to this step
//@checkFunction is the function that checks if the step is complete
interface ChecklistInfo {
  prev: number;
  next: number;
  isCheckpoint: boolean;
  checkFunction: (...args: any[]) => boolean;
}
export const BridgeInChecklistFunctionTracker: ChecklistTracker = {
  [BridgeInStatus.SELECT_ETH]: {
    prev: BridgeInStatus.SELECT_ETH,
    next: BridgeInStatus.SWTICH_TO_ETH,
    isCheckpoint: true,
    checkFunction: (txType: string) => txType == "Bridge",
  },
  [BridgeInStatus.SWTICH_TO_ETH]: {
    prev: BridgeInStatus.SELECT_ETH,
    next: BridgeInStatus.SELECT_ERC20_TOKEN,
    isCheckpoint: false,
    checkFunction: (chainId: number) => chainId == ETHMainnet.chainId,
  },
  [BridgeInStatus.SELECT_ERC20_TOKEN]: {
    prev: BridgeInStatus.SWTICH_TO_ETH,
    next: BridgeInStatus.SEND_FUNDS_TO_GBRIDGE,
    isCheckpoint: false,
    checkFunction: (bridgeInDisabled: boolean) => !bridgeInDisabled,
  },
  [BridgeInStatus.SEND_FUNDS_TO_GBRIDGE]: {
    prev: BridgeInStatus.SELECT_ERC20_TOKEN,
    next: BridgeInStatus.WAIT_FOR_GRBIDGE,
    isCheckpoint: false,
    checkFunction: (txHash: string | undefined) => !!txHash,
  },
  [BridgeInStatus.WAIT_FOR_GRBIDGE]: {
    prev: BridgeInStatus.SEND_FUNDS_TO_GBRIDGE,
    next: BridgeInStatus.SELECT_CONVERT,
    isCheckpoint: true,
    checkFunction: (completedTxs: EventWithTime[], currentTxHash: string) => {
      for (const tx of completedTxs) {
        if (tx.transactionHash == currentTxHash) {
          return true;
        }
      }
      return false;
    },
  },
  [BridgeInStatus.SELECT_CONVERT]: {
    prev: BridgeInStatus.WAIT_FOR_GRBIDGE,
    next: BridgeInStatus.SWITCH_TO_CANTO,
    isCheckpoint: false,
    checkFunction: (txType: string) => txType == "Convert",
  },
  [BridgeInStatus.SWITCH_TO_CANTO]: {
    prev: BridgeInStatus.SELECT_CONVERT,
    next: BridgeInStatus.SELECT_NATIVE_TOKEN,
    isCheckpoint: false,
    checkFunction: (chainId: number) => chainId == CantoMainnet.chainId,
  },
  [BridgeInStatus.SELECT_NATIVE_TOKEN]: {
    prev: BridgeInStatus.SWITCH_TO_CANTO,
    next: BridgeInStatus.CONVERT,
    isCheckpoint: false,
    checkFunction: (convertDisabled: boolean) => !convertDisabled,
  },
  [BridgeInStatus.CONVERT]: {
    prev: BridgeInStatus.SELECT_NATIVE_TOKEN,
    next: BridgeInStatus.COMPLETE,
    isCheckpoint: false,
    checkFunction: (converted: boolean) => converted,
  },
  [BridgeInStatus.COMPLETE]: {
    prev: BridgeInStatus.CONVERT,
    next: BridgeInStatus.COMPLETE,
    isCheckpoint: true,
    checkFunction: () => true,
  },
};
export const BridgeOutChecklistFunctionTracker: ChecklistTracker = {
  [BridgeOutStatus.SELECT_CONVERT]: {
    prev: BridgeOutStatus.SELECT_CONVERT,
    next: BridgeOutStatus.SWITCH_TO_CANTO,
    isCheckpoint: true,
    checkFunction: (txType: string) => txType == "Bridge",
  },
  [BridgeOutStatus.SWITCH_TO_CANTO]: {
    prev: BridgeOutStatus.SELECT_CONVERT,
    next: BridgeOutStatus.SELECT_CONVERT_TOKEN,
    isCheckpoint: false,
    checkFunction: (chainId: number) => chainId == CantoMainnet.chainId,
  },
  [BridgeOutStatus.SELECT_CONVERT_TOKEN]: {
    prev: BridgeOutStatus.SWITCH_TO_CANTO,
    next: BridgeOutStatus.CONVERT_COIN,
    isCheckpoint: false,
    checkFunction: (convertDisabled: boolean) => !convertDisabled,
  },
  [BridgeOutStatus.CONVERT_COIN]: {
    prev: BridgeOutStatus.SELECT_CONVERT_TOKEN,
    next: BridgeOutStatus.SELECT_BRIDGE,
    isCheckpoint: false,
    checkFunction: (converted: boolean) => converted,
  },
  [BridgeOutStatus.SELECT_BRIDGE]: {
    prev: BridgeOutStatus.CONVERT_COIN,
    next: BridgeOutStatus.SELECT_NATIVE_TOKEN,
    isCheckpoint: true,
    checkFunction: (txType: string) => txType == "Convert",
  },
  [BridgeOutStatus.SELECT_NATIVE_TOKEN]: {
    prev: BridgeOutStatus.SELECT_BRIDGE,
    next: BridgeOutStatus.SEND_TO_GRBIDGE,
    isCheckpoint: false,
    checkFunction: (bridgeOutDisabled: boolean) => !bridgeOutDisabled,
  },
  [BridgeOutStatus.SEND_TO_GRBIDGE]: {
    prev: BridgeOutStatus.SELECT_NATIVE_TOKEN,
    next: BridgeOutStatus.COMPLETE,
    isCheckpoint: false,
    checkFunction: (completed: boolean) => completed,
  },
  [BridgeOutStatus.COMPLETE]: {
    prev: BridgeOutStatus.SEND_TO_GRBIDGE,
    next: BridgeOutStatus.COMPLETE,
    isCheckpoint: true,
    checkFunction: () => true,
  },
};

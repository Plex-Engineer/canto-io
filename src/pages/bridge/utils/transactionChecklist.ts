import { CantoMainnet } from "global/config/networks";
import { ETHMainnet } from "../config/networks";
import {
  BridgeInStatus,
  BridgeInTransactionChecklistStatus,
  BridgeOutStatus,
  BridgeOutTransactionChecklistStatus,
} from "../stores/transactionChecklistStore";
import { EventWithTime } from "./utils";

export function updateLastBridgeInTransactionStatus(
  setter: (status: BridgeInStatus, txHash: string | undefined) => void,
  currentTx: BridgeInTransactionChecklistStatus,
  txType: string,
  chainId: number,
  bridgeInDisabled: boolean,
  completedTxs: EventWithTime[],
  convertDisabled: boolean
) {
  const nextStatus = checkCurrentBridgeInStep(
    currentTx,
    txType,
    chainId,
    bridgeInDisabled,
    completedTxs,
    convertDisabled
  );
  setter(nextStatus, currentTx.txHash);
}
function checkCurrentBridgeInStep(
  currentTx: BridgeInTransactionChecklistStatus,
  txType: string,
  chainId: number,
  bridgeInDisabled: boolean,
  completedTxs: EventWithTime[],
  convertDisabled: boolean
): BridgeInStatus {
  const currentStep = currentTx.currentStep;
  switch (currentStep) {
    case BridgeInStatus.SELECT_ETH: {
      if (txType == "Bridge") {
        return BridgeInStatus.SWTICH_TO_ETH;
      }
      return currentStep;
    }
    case BridgeInStatus.SWTICH_TO_ETH: {
      if (chainId == ETHMainnet.chainId) {
        return BridgeInStatus.SELECT_ERC20_TOKEN;
      }
      return currentStep;
    }
    case BridgeInStatus.SELECT_ERC20_TOKEN: {
      if (!bridgeInDisabled) {
        return BridgeInStatus.SEND_FUNDS_TO_GBRIDGE;
      }
      return currentStep;
    }
    case BridgeInStatus.SEND_FUNDS_TO_GBRIDGE: {
      if (currentTx.txHash) {
        return BridgeInStatus.WAIT_FOR_GRBIDGE;
      }
      return currentStep;
    }
    case BridgeInStatus.WAIT_FOR_GRBIDGE: {
      for (const tx of completedTxs) {
        if (tx.transactionHash == currentTx.txHash) {
          return BridgeInStatus.SELECT_CONVERT;
        }
      }
      return currentStep;
    }
    case BridgeInStatus.SELECT_CONVERT: {
      if (txType == "Convert") {
        return BridgeInStatus.SWITCH_TO_CANTO;
      }
      return currentStep;
    }
    case BridgeInStatus.SWITCH_TO_CANTO: {
      if (chainId == CantoMainnet.chainId) {
        return BridgeInStatus.SELECT_NATIVE_TOKEN;
      }
      return currentStep;
    }
    case BridgeInStatus.SELECT_NATIVE_TOKEN: {
      if (!convertDisabled) {
        return BridgeInStatus.CONVERT;
      }
      return currentStep;
    }
    case BridgeInStatus.CONVERT: {
      //this state will be updated in the convert transfer box once the tx is complete
      return currentStep;
    }
    default:
      return currentStep;
  }
}

export function updateLastBridgeOutTransactionStatus(
  setter: (status: BridgeOutStatus, txHash: string | undefined) => void,
  currentTx: BridgeOutTransactionChecklistStatus,
  txType: string,
  chainId: number,
  convertDisabled: boolean,
  bridgeOutDisabled: boolean
) {
  const nextStatus = checkCurrentBridgeOutStep(
    currentTx,
    txType,
    chainId,
    convertDisabled,
    bridgeOutDisabled
  );
  setter(nextStatus, currentTx.txHash);
}
function checkCurrentBridgeOutStep(
  currentTx: BridgeOutTransactionChecklistStatus,
  txType: string,
  chainId: number,
  convertDisabled: boolean,
  bridgeOutDisabled: boolean
): BridgeOutStatus {
  const currentStep = currentTx.currentStep;
  switch (currentStep) {
    case BridgeOutStatus.SELECT_CONVERT: {
      if (txType == "Bridge") {
        return BridgeOutStatus.SWITCH_TO_CANTO;
      }
      return currentStep;
    }
    case BridgeOutStatus.SWITCH_TO_CANTO: {
      if (chainId == CantoMainnet.chainId) {
        return BridgeOutStatus.SELECT_CONVERT_TOKEN;
      }
      return currentStep;
    }
    case BridgeOutStatus.SELECT_CONVERT_TOKEN: {
      if (!convertDisabled) {
        return BridgeOutStatus.CONVERT_COIN;
      }
      return currentStep;
    }
    case BridgeOutStatus.CONVERT_COIN: {
      //this state will be updated in the convert transfer box, we will not check the tx here since it is automatic once convert is done
      return currentStep;
    }
    case BridgeOutStatus.SELECT_BRIDGE: {
      if (txType == "Convert") {
        return BridgeOutStatus.SELECT_NATIVE_TOKEN;
      }
      return currentStep;
    }
    case BridgeOutStatus.SELECT_NATIVE_TOKEN: {
      if (!bridgeOutDisabled) {
        return BridgeOutStatus.SEND_TO_GRBIDGE;
      }
      return currentStep;
    }
    case BridgeOutStatus.SEND_TO_GRBIDGE: {
      //this state will aslo be updated in the transfer box, tx is quick
      return currentStep;
    }
    default:
      return currentStep;
  }
}

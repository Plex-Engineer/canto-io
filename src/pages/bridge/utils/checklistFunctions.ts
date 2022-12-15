import {
  BridgeInChecklistFunctionTracker,
  BridgeOutChecklistFunctionTracker,
  ChecklistTracker,
} from "../config/transactionChecklist";
import {
  BridgeInStatus,
  BridgeInTransactionChecklistStatus,
  BridgeOutStatus,
  BridgeOutTransactionChecklistStatus,
} from "../stores/transactionChecklistStore";
import { EventWithTime } from "./utils";

function getLastCheckpoint(tracker: ChecklistTracker, currentStep: number) {
  let lastCheckpoint = currentStep;
  while (!tracker[lastCheckpoint].isCheckpoint) {
    lastCheckpoint = tracker[lastCheckpoint].prev;
  }
  return lastCheckpoint;
}
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
  let stepToCheck = getLastCheckpoint(
    BridgeInChecklistFunctionTracker,
    currentTx.currentStep
  );
  let checkNextStep = true;
  while (checkNextStep) {
    const didPass = didPassBridgeInCheck(
      stepToCheck,
      txType,
      chainId,
      bridgeInDisabled,
      currentTx.txHash,
      completedTxs,
      convertDisabled
    );
    if (didPass) {
      stepToCheck = BridgeInChecklistFunctionTracker[stepToCheck].next;
    } else {
      checkNextStep = false;
    }
  }
  return stepToCheck;
}

function didPassBridgeInCheck(
  currentStep: BridgeInStatus,
  txType: string,
  chainId: number,
  bridgeInDisabled: boolean,
  txHash: string | undefined,
  completedTxs: EventWithTime[],
  convertDisabled: boolean
): boolean {
  const currentCheckFunction =
    BridgeInChecklistFunctionTracker[currentStep].checkFunction;
  switch (currentStep) {
    case BridgeInStatus.SELECT_ETH: {
      return currentCheckFunction(txType);
    }
    case BridgeInStatus.SWTICH_TO_ETH: {
      return currentCheckFunction(chainId);
    }
    case BridgeInStatus.SELECT_ERC20_TOKEN: {
      return currentCheckFunction(bridgeInDisabled);
    }
    case BridgeInStatus.SEND_FUNDS_TO_GBRIDGE: {
      return currentCheckFunction(txHash);
    }
    case BridgeInStatus.WAIT_FOR_GRBIDGE: {
      return currentCheckFunction(completedTxs, txHash);
    }
    case BridgeInStatus.SELECT_CONVERT: {
      return currentCheckFunction(txType);
    }
    case BridgeInStatus.SWITCH_TO_CANTO: {
      return currentCheckFunction(chainId);
    }
    case BridgeInStatus.SELECT_NATIVE_TOKEN: {
      return currentCheckFunction(convertDisabled);
    }
    case BridgeInStatus.CONVERT: {
      //cannot check this here, must be done in convert transfer boc
      return false;
    }
    default:
      return false;
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
  let stepToCheck = getLastCheckpoint(
    BridgeOutChecklistFunctionTracker,
    currentTx.currentStep
  );
  let checkNextStep = true;
  while (checkNextStep) {
    const didPass = didPassBridgeOutCheck(
      stepToCheck,
      txType,
      chainId,
      convertDisabled,
      bridgeOutDisabled
    );
    if (didPass) {
      stepToCheck = BridgeOutChecklistFunctionTracker[stepToCheck].next;
    } else {
      checkNextStep = false;
    }
  }
  return stepToCheck;
}

function didPassBridgeOutCheck(
  currentStep: BridgeOutStatus,
  txType: string,
  chainId: number,
  convertDisabled: boolean,
  bridgeOutDisabled: boolean
): boolean {
  const currentCheckFunction =
    BridgeOutChecklistFunctionTracker[currentStep].checkFunction;
  switch (currentStep) {
    case BridgeOutStatus.SELECT_CONVERT: {
      return currentCheckFunction(txType);
    }
    case BridgeOutStatus.SWITCH_TO_CANTO: {
      return currentCheckFunction(chainId);
    }
    case BridgeOutStatus.SELECT_CONVERT_TOKEN: {
      return currentCheckFunction(convertDisabled);
    }
    case BridgeOutStatus.CONVERT_COIN: {
      //this state will be updated in the convert transfer box, we will not check the tx here since it is automatic once convert is done
      return false;
    }
    case BridgeOutStatus.SELECT_BRIDGE: {
      return currentCheckFunction(txType);
    }
    case BridgeOutStatus.SELECT_NATIVE_TOKEN: {
      return currentCheckFunction(bridgeOutDisabled);
    }
    case BridgeOutStatus.SEND_TO_GRBIDGE: {
      //this state will aslo be updated in the transfer box, tx is quick
      return false;
    }
    default:
      return false;
  }
}

import { BigNumber } from "ethers";
import { BaseToken } from "../config/interfaces";
import { BridgeOutStep, BridgeOutWalkthroughSteps } from "./walkthroughTracker";

export function didPassBridgeOutWalkthroughCheck(
  currentStep: BridgeOutStep,
  chainId: number,
  convertToken: BaseToken,
  convertOutAmount: BigNumber,
  maxConvertOutAmount: BigNumber
): boolean {
  const currentCheckFunction =
    BridgeOutWalkthroughSteps[currentStep].checkFunction;
  switch (currentStep) {
    case BridgeOutStep.SWITCH_TO_CANTO: {
      return currentCheckFunction(chainId);
    }
    case BridgeOutStep.SELECT_CONVERT_TOKEN: {
      return currentCheckFunction(convertToken);
    }
    case BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT: {
      return currentCheckFunction(convertOutAmount, maxConvertOutAmount);
    }
    // case BridgeOutStep.CONVERT_COIN: {
    //   //this state will be updated in the convert transfer box, we will not check the tx here since it is automatic once convert is done
    //   return false;
    // }
    // case BridgeOutStep.SELECT_NATIVE_TOKEN: {
    //   return currentCheckFunction(bridgeOutDisabled);
    // }
    // case BridgeOutStep.SEND_TO_GRBIDGE: {
    //   //this state will aslo be updated in the transfer box, tx is quick
    //   return false;
    // }
    default:
      return true;
  }
}

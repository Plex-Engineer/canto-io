import { BigNumber } from "ethers";
import { TransactionState } from "global/config/transactionTypes";
import { BridgeOutNetworkInfo } from "../config/gravityBridgeTokens";
import { BaseToken, UserNativeTokens } from "../config/interfaces";
import { BridgeOutStep, BridgeOutWalkthroughSteps } from "./walkthroughTracker";

export function didPassBridgeOutWalkthroughCheck(
  currentStep: BridgeOutStep,
  chainId: number,
  convertToken: BaseToken,
  convertOutAmount: BigNumber,
  maxConvertOutAmount: BigNumber,
  convertTxState: TransactionState,
  bridgeOutNetwork: BridgeOutNetworkInfo,
  bridgeOutToken: UserNativeTokens,
  bridgeOutAmount: BigNumber,
  maxBridgeOutAmount: BigNumber,
  bridgeOutStatus: TransactionState
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
    case BridgeOutStep.CONVERT_COIN: {
      return currentCheckFunction(convertTxState);
    }
    case BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK: {
      return currentCheckFunction(bridgeOutNetwork.name);
    }
    case BridgeOutStep.SELECT_NATIVE_TOKEN: {
      return currentCheckFunction(bridgeOutToken);
    }
    case BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT: {
      return currentCheckFunction(bridgeOutAmount, maxBridgeOutAmount);
    }
    case BridgeOutStep.SEND_TO_GRBIDGE: {
      return currentCheckFunction(bridgeOutStatus);
    }
    default:
      return true;
  }
}

import { BigNumber } from "ethers";
import { TransactionState } from "global/config/transactionTypes";
import { BridgeOutNetworkInfo } from "../config/gravityBridgeTokens";
import {
  BaseToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "../config/interfaces";
import { EventWithTime } from "../utils/bridgeTxPageUtils";
import {
  BridgeInStep,
  BridgeInWalkthroughSteps,
  BridgeOutStep,
  BridgeOutWalkthroughSteps,
} from "./walkthroughTracker";

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
export function didPassBridgeInWalkthroughCheck(
  currentStep: BridgeInStep,
  chainId: number,
  ethGToken: UserGravityBridgeTokens,
  bridgeInAmount: BigNumber,
  maxBridgeInAmount: BigNumber,
  bridgeInTxHash: string | undefined,
  completedBridgeInTxs: EventWithTime[],
  convertToken: BaseToken,
  convertInAmount: BigNumber,
  maxConvertInAmount: BigNumber,
  convertTxState: TransactionState
): boolean {
  const currentCheckFunction =
    BridgeInWalkthroughSteps[currentStep].checkFunction;
  switch (currentStep) {
    case BridgeInStep.SWTICH_TO_ETH: {
      return currentCheckFunction(chainId);
    }
    case BridgeInStep.SELECT_ERC20_TOKEN: {
      return currentCheckFunction(ethGToken);
    }
    case BridgeInStep.SELECT_ERC20_AMOUNT: {
      return currentCheckFunction(bridgeInAmount, maxBridgeInAmount);
    }
    case BridgeInStep.SEND_FUNDS_TO_GBRIDGE: {
      return currentCheckFunction(bridgeInTxHash);
    }
    case BridgeInStep.WAIT_FOR_GRBIDGE: {
      return currentCheckFunction(completedBridgeInTxs, bridgeInTxHash);
    }
    case BridgeInStep.SWITCH_TO_CANTO: {
      return currentCheckFunction(chainId);
    }
    case BridgeInStep.SELECT_CONVERT_TOKEN: {
      return currentCheckFunction(convertToken);
    }
    case BridgeInStep.SELECT_CONVERT_TOKEN_AMOUNT: {
      return currentCheckFunction(convertInAmount, maxConvertInAmount);
    }
    case BridgeInStep.CONVERT: {
      return currentCheckFunction(convertTxState);
    }
    default:
      return true;
  }
}

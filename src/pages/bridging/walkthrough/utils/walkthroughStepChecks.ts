import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import {
  BridgeOutNetworks,
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";
import { TransactionHistoryEvent } from "pages/bridging/utils/bridgeTxHistory";
import {
  BridgeInStep,
  BridgeInWalkthroughSteps,
  BridgeOutStep,
  BridgeOutWalkthroughSteps,
} from "../config/interfaces";

export function didPassBridgeOutWalkthroughCheck(
  currentStep: BridgeOutStep,
  chainId: number,
  convertToken: UserERC20BridgeToken,
  convertOutAmount: BigNumber,
  maxConvertOutAmount: BigNumber,
  convertTxState: TransactionState,
  bridgeOutNetwork: BridgeOutNetworks,
  bridgeOutToken: UserNativeToken,
  bridgeOutStatus: TransactionState,
  bridgeOutSendAddress: string
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
      return currentCheckFunction(bridgeOutNetwork, bridgeOutSendAddress);
    }
    case BridgeOutStep.SELECT_NATIVE_TOKEN: {
      return currentCheckFunction(bridgeOutToken);
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
  ethGToken: UserERC20BridgeToken,
  bridgeInAmount: BigNumber,
  maxBridgeInAmount: BigNumber,
  bridgeInTxHash: string | undefined,
  completedBridgeInTxs: TransactionHistoryEvent[],
  convertToken: UserNativeToken,
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
    case BridgeInStep.NEED_ALLOWANCE: {
      return currentCheckFunction(ethGToken, maxBridgeInAmount);
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
    case BridgeInStep.CONVERT: {
      return currentCheckFunction(convertTxState);
    }
    default:
      return true;
  }
}

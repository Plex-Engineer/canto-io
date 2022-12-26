import { CantoMainnet } from "global/config/networks";
import { BaseToken, EmptySelectedConvertToken } from "../config/interfaces";

interface WalkthroughStep {
  prev: number | undefined;
  next: number | undefined;
  checkFunction: (...args: any[]) => boolean;
}

interface WalkthroughTracker {
  [key: number]: WalkthroughStep;
}
export enum BridgeInStep {
  CHECK_NATIVE_TOKEN_BALANCE,
  SWTICH_TO_ETH,
  SELECT_ERC20_TOKEN,
  SELECT_ERC20_AMOUNT,
  SEND_FUNDS_TO_GBRIDGE,
  WAIT_FOR_GRBIDGE,
  SWITCH_TO_CANTO,
  SELECT_NATIVE_TOKEN,
  SELECT_NATIVE_TOKEN_AMOUNT,
  CONVERT,
  COMPLETE,
}
export enum BridgeOutStep {
  //   CHECK_NATIVE_TOKEN_BALANCE,
  SWITCH_TO_CANTO,
  SELECT_CONVERT_TOKEN,
  SELECT_CONVERT_TOKEN_AMOUNT,
  CONVERT_COIN,
  SELECT_NATIVE_TOKEN,
  SELECT_NATIVE_TOKEN_AMOUNT,
  SEND_TO_GRBIDGE,
  COMPLETE,
}
export const BridgeInWalkthroughSteps: WalkthroughTracker = {
  //   [BridgeInSteps.START]: {
  //     prev: -1,
  //     next: () => BridgeInSteps.SWTICH_TO_ETH,
  //     component: BridgeInStart(),
  //     checkFunction: () => true,
  //   },
};

export const BridgeOutWalkthroughSteps: WalkthroughTracker = {
  [BridgeOutStep.SWITCH_TO_CANTO]: {
    prev: undefined,
    next: BridgeOutStep.SWITCH_TO_CANTO,
    checkFunction: (chainId: number | undefined) =>
      chainId == CantoMainnet.chainId,
  },
  [BridgeOutStep.SELECT_CONVERT_TOKEN]: {
    prev: BridgeOutStep.SWITCH_TO_CANTO,
    next: BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT,
    checkFunction: (token: BaseToken) => token != EmptySelectedConvertToken,
  },
  [BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT]: {
    prev: BridgeOutStep.SELECT_CONVERT_TOKEN,
    next: undefined,
    checkFunction: () => true,
  },
};
import { BigNumber } from "ethers";
import { CantoMainnet } from "global/config/networks";
import { TransactionState } from "global/config/transactionTypes";
import { UserConvertToken, UserNativeTokens } from "../config/interfaces";

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
  SELECT_BRIDGE_OUT_NETWORK,
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
    checkFunction: (token: UserConvertToken) => !token.erc20Balance.lt(0),
  },
  [BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT]: {
    prev: BridgeOutStep.SELECT_CONVERT_TOKEN,
    next: BridgeOutStep.CONVERT_COIN,
    checkFunction: (amount: BigNumber, max: BigNumber) =>
      amount.gt(0) && amount.lte(max),
  },
  [BridgeOutStep.CONVERT_COIN]: {
    prev: BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT,
    next: BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK,
    checkFunction: (txStatus: TransactionState) => txStatus === "Success",
  },
  [BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK]: {
    prev: BridgeOutStep.CONVERT_COIN,
    next: BridgeOutStep.SELECT_NATIVE_TOKEN,
    checkFunction: (network: string) => !!network,
  },
  [BridgeOutStep.SELECT_NATIVE_TOKEN]: {
    prev: BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK,
    next: BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT,
    checkFunction: (token: UserNativeTokens) => !token.nativeBalance.lte(0),
  },
  [BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT]: {
    prev: BridgeOutStep.SELECT_NATIVE_TOKEN,
    next: BridgeOutStep.SEND_TO_GRBIDGE,
    checkFunction: (amount: BigNumber, max: BigNumber) =>
      amount.gt(0) && amount.lte(max),
  },
  [BridgeOutStep.SEND_TO_GRBIDGE]: {
    prev: BridgeOutStep.SELECT_NATIVE_TOKEN,
    next: BridgeOutStep.COMPLETE,
    checkFunction: (txStatus: TransactionState) => txStatus === "Success",
  },
  [BridgeOutStep.COMPLETE]: {
    prev: BridgeOutStep.SEND_TO_GRBIDGE,
    next: undefined,
    checkFunction: () => true,
  },
};

import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { CantoMainnet, ETHMainnet } from "global/config/networks";
import { CANTO_MAIN_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import {
  CantoMainBridgeOutNetworks,
  UserERC20BridgeToken,
  UserNativeToken,
} from "pages/bridging/config/interfaces";
import { TransactionHistoryEvent } from "pages/bridging/utils/bridgeTxHistory";

interface WalkthroughStep {
  prev: number | undefined;
  next: number | undefined;
  checkFunction: (...args: any[]) => boolean;
  isCheckpoint: boolean;
}

interface WalkthroughTracker {
  [key: number]: WalkthroughStep;
}
export enum BridgeInStep {
  SWTICH_TO_ETH,
  SELECT_ERC20_TOKEN,
  NEED_ALLOWANCE,
  SELECT_ERC20_AMOUNT,
  SEND_FUNDS_TO_GBRIDGE,
  WAIT_FOR_GRBIDGE,
  SWITCH_TO_CANTO,
  SELECT_CONVERT_TOKEN,
  //   SELECT_CONVERT_TOKEN_AMOUNT,
  CONVERT,
  COMPLETE,
}
export enum BridgeOutStep {
  SWITCH_TO_CANTO,
  SELECT_CONVERT_TOKEN,
  SELECT_CONVERT_TOKEN_AMOUNT,
  CONVERT_COIN,
  SWITCH_TO_CANTO_2,
  SELECT_BRIDGE_OUT_NETWORK,
  SELECT_NATIVE_TOKEN,
  //   SELECT_NATIVE_TOKEN_AMOUNT,
  SEND_TO_GRBIDGE,
  COMPLETE,
}
export const BridgeInWalkthroughSteps: WalkthroughTracker = {
  [BridgeInStep.SWTICH_TO_ETH]: {
    isCheckpoint: false,
    prev: undefined,
    next: BridgeInStep.SELECT_ERC20_TOKEN,
    checkFunction: (chainId: number) => chainId == ETHMainnet.chainId,
  },
  [BridgeInStep.SELECT_ERC20_TOKEN]: {
    isCheckpoint: false,
    prev: BridgeInStep.SWTICH_TO_ETH,
    next: BridgeInStep.NEED_ALLOWANCE,
    checkFunction: (token: UserERC20BridgeToken) => !token.erc20Balance.lte(0),
  },
  [BridgeInStep.NEED_ALLOWANCE]: {
    isCheckpoint: false,
    prev: BridgeInStep.SELECT_ERC20_TOKEN,
    next: BridgeInStep.SELECT_ERC20_AMOUNT,
    checkFunction: (token: UserERC20BridgeToken, max: BigNumber) =>
      !token.allowance.lte(max),
  },
  [BridgeInStep.SELECT_ERC20_AMOUNT]: {
    isCheckpoint: false,
    prev: BridgeInStep.NEED_ALLOWANCE,
    next: BridgeInStep.SEND_FUNDS_TO_GBRIDGE,
    checkFunction: (amount: BigNumber, max: BigNumber) =>
      amount.gt(0) && amount.lte(max),
  },
  [BridgeInStep.SEND_FUNDS_TO_GBRIDGE]: {
    isCheckpoint: false,
    prev: BridgeInStep.SELECT_ERC20_AMOUNT,
    next: BridgeInStep.WAIT_FOR_GRBIDGE,
    checkFunction: (txHash: string | undefined) => !!txHash,
  },
  [BridgeInStep.WAIT_FOR_GRBIDGE]: {
    isCheckpoint: false,
    prev: BridgeInStep.SEND_FUNDS_TO_GBRIDGE,
    next: BridgeInStep.SWITCH_TO_CANTO,
    checkFunction: (
      completedTxs: TransactionHistoryEvent[],
      currentTxHash: string
    ) => {
      for (const tx of completedTxs) {
        if (tx.txHash == currentTxHash) {
          return true;
        }
      }
      return false;
    },
  },
  [BridgeInStep.SWITCH_TO_CANTO]: {
    isCheckpoint: true,
    prev: BridgeInStep.WAIT_FOR_GRBIDGE,
    next: BridgeInStep.SELECT_CONVERT_TOKEN,
    checkFunction: (chainId: number) => chainId == CantoMainnet.chainId,
  },
  [BridgeInStep.SELECT_CONVERT_TOKEN]: {
    isCheckpoint: false,
    prev: BridgeInStep.SWITCH_TO_CANTO,
    next: BridgeInStep.CONVERT,
    checkFunction: (token: UserNativeToken) => !token.nativeBalance.lte(0),
  },
  //   [BridgeInStep.SELECT_CONVERT_TOKEN_AMOUNT]: {
  //     isCheckpoint: false,
  //     prev: BridgeInStep.SELECT_CONVERT_TOKEN,
  //     next: BridgeInStep.CONVERT,
  //     checkFunction: (amount: BigNumber, max: BigNumber) =>
  //       amount.gt(0) && amount.lte(max),
  //   },
  [BridgeInStep.CONVERT]: {
    isCheckpoint: false,
    prev: BridgeInStep.SELECT_CONVERT_TOKEN,
    next: BridgeInStep.COMPLETE,
    checkFunction: (txStatus: TransactionState) => txStatus === "Success",
  },
  [BridgeInStep.COMPLETE]: {
    isCheckpoint: false,
    prev: BridgeInStep.CONVERT,
    next: undefined,
    checkFunction: () => true,
  },
};

export const BridgeOutWalkthroughSteps: WalkthroughTracker = {
  [BridgeOutStep.SWITCH_TO_CANTO]: {
    isCheckpoint: false,
    prev: undefined,
    next: BridgeOutStep.SELECT_CONVERT_TOKEN,
    checkFunction: (chainId: number | undefined) =>
      chainId == CantoMainnet.chainId,
  },
  [BridgeOutStep.SELECT_CONVERT_TOKEN]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SWITCH_TO_CANTO,
    next: BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT,
    checkFunction: (token: UserERC20BridgeToken) => !token.erc20Balance.lte(0),
  },
  [BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SELECT_CONVERT_TOKEN,
    next: BridgeOutStep.CONVERT_COIN,
    checkFunction: (amount: BigNumber, max: BigNumber) =>
      amount.gt(0) && amount.lte(max),
  },
  [BridgeOutStep.CONVERT_COIN]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT,
    next: BridgeOutStep.SWITCH_TO_CANTO_2,
    checkFunction: (txStatus: TransactionState) => txStatus === "Success",
  },
  [BridgeOutStep.SWITCH_TO_CANTO_2]: {
    isCheckpoint: true,
    prev: BridgeOutStep.CONVERT_COIN,
    next: BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK,
    checkFunction: (chainId: number | undefined) =>
      chainId == CantoMainnet.chainId,
  },
  [BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SWITCH_TO_CANTO_2,
    next: BridgeOutStep.SELECT_NATIVE_TOKEN,
    checkFunction: (
      network: CantoMainBridgeOutNetworks,
      cosmosAddress: string
    ) => {
      return CANTO_MAIN_BRIDGE_OUT_NETWORKS[network].checkAddress(
        cosmosAddress
      );
    },
  },
  [BridgeOutStep.SELECT_NATIVE_TOKEN]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK,
    next: BridgeOutStep.SEND_TO_GRBIDGE,
    checkFunction: (token: UserNativeToken) => !token.nativeBalance.lte(0),
  },
  //   [BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT]: {
  //     isCheckpoint: false,
  //     prev: BridgeOutStep.SELECT_NATIVE_TOKEN,
  //     next: BridgeOutStep.SEND_TO_GRBIDGE,
  //     checkFunction: (amount: BigNumber, max: BigNumber) =>
  //       amount.gt(0) && amount.lte(max),
  //   },
  [BridgeOutStep.SEND_TO_GRBIDGE]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SELECT_NATIVE_TOKEN,
    next: BridgeOutStep.COMPLETE,
    checkFunction: (txStatus: TransactionState) => txStatus === "Success",
  },
  [BridgeOutStep.COMPLETE]: {
    isCheckpoint: false,
    prev: BridgeOutStep.SEND_TO_GRBIDGE,
    next: undefined,
    checkFunction: () => true,
  },
};

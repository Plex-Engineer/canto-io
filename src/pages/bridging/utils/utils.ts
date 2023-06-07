import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { toastHandler } from "global/utils/toastHandler";
import {
  NativeTransaction,
  UserNativeToken,
} from "../config/bridgingInterfaces";
import { TransactionHistoryEvent } from "./bridgeTxHistory";
import { getNetworkFromTokenName } from "./findTokens";

export function createConvertTransactions(
  pendingIn: TransactionHistoryEvent[],
  nativeTokens: UserNativeToken[],
  bridgeIn: boolean,
  chainId?: number
): NativeTransaction[] {
  const allConverts: NativeTransaction[] = [];
  for (const pending of pendingIn) {
    if (pending.token) {
      allConverts.push({
        origin: pending.from,
        timeLeft: pending.secondsToComplete,
        amount: pending.amount,
        token: pending.token as UserNativeToken,
      });
    }
  }
  for (const native of nativeTokens) {
    if (native.nativeBalance.gt(0)) {
      allConverts.push({
        origin: getNetworkFromTokenName(native.ibcDenom, bridgeIn, chainId),
        timeLeft: "0",
        amount: native.nativeBalance,
        token: native,
      });
    }
  }
  return allConverts;
}
export function copyAddress() {
  toastHandler("copied address", true, "0", 300);
}
export function toastBridgeTx(txState: TransactionState, txName: string) {
  if (txState == "Fail" || txState == "Success") {
    const success = txState == "Success";
    const msg = success ? " successful" : " unsuccessful";
    toastHandler(txName + msg, success, txName);
  }
}

export function convertSecondsToString(seconds: string) {
  if (Number(seconds) < 0) {
    return "pending...";
  }
  if (Number(seconds) == 0) {
    return "done";
  }
  if (Number(seconds) <= 60) {
    return seconds + " seconds";
  }
  const minutes = Math.ceil(Number(seconds) / 60);
  return minutes + " min";
}

export function formatAddress(address: string | undefined, show: number) {
  return !address
    ? ""
    : address.length <= show * 2
    ? address
    : address.slice(0, show) + "..." + address.slice(-show);
}

//returns button text and if it is disabled
export function getStep1ButtonText(
  amount: BigNumber,
  max: BigNumber,
  bridgeIn: boolean
): [string, boolean] {
  const bText = bridgeIn ? "bridge in" : "bridge out";
  if (amount.isZero()) {
    return [bText, true];
  } else if (amount.gt(max)) {
    return [bText, true];
  } else {
    return [bText, false];
  }
}

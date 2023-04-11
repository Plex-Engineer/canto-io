import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { toastHandler } from "global/utils/toastHandler";
import { truncateNumber } from "global/utils/utils";
import { NativeTransaction, UserNativeToken } from "../config/interfaces";
import { TransactionHistoryEvent } from "./bridgeTxHistory";
import { getNetworkFromTokenName } from "./findTokens";

export function createConvertTransactions(
  pendingIn: TransactionHistoryEvent[],
  nativeTokens: UserNativeToken[],
  bridgeIn: boolean
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
        origin: getNetworkFromTokenName(native.ibcDenom, bridgeIn),
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

export function convertStringToBigNumber(amount: string, decimals: number) {
  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    return BigNumber.from(0);
  }
  return parseUnits(truncateNumber(amount, decimals), decimals);
}

export function formatAddress(address: string, show: number) {
  return address.slice(0, show) + "..." + address.slice(-show);
}

//returns button text and if it is disabled
export function getStep1ButtonText(
  amount: BigNumber,
  max: BigNumber,
  currentAllowance: BigNumber,
  bridgeIn: boolean
): [string, boolean] {
  const bText = bridgeIn ? "bridge in" : "bridge out";
  if (currentAllowance.lt(max) || currentAllowance.isZero()) {
    return ["approve", false];
  } else if (amount.isZero()) {
    return [bText, true];
  } else if (amount.gt(max)) {
    return [bText, true];
  } else {
    return [bText, false];
  }
}

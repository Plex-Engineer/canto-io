import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { ConvertTransaction, UserConvertToken } from "../config/interfaces";
import { TransactionHistoryEvent } from "./bridgeTxHistory";
import { getNetworkFromTokenName } from "./findTokens";

export function createConvertTransactions(
  pendingIn: TransactionHistoryEvent[],
  nativeTokens: UserConvertToken[]
): ConvertTransaction[] {
  const allConverts: ConvertTransaction[] = [];
  for (const pending of pendingIn) {
    if (pending.token) {
      allConverts.push({
        origin: pending.from,
        timeLeft: pending.secondsToComplete,
        amount: pending.amount,
        token: pending.token as UserConvertToken,
      });
    }
  }
  for (const native of nativeTokens) {
    if (native.nativeBalance.gt(0)) {
      allConverts.push({
        origin: getNetworkFromTokenName(native.ibcDenom),
        timeLeft: "0",
        amount: native.nativeBalance,
        token: native,
      });
    }
  }
  return allConverts;
}

export function convertSecondsToString(seconds: string) {
  if (Number(seconds) < 0) {
    return "pending verification...";
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

//returns button text and if it is disabled
export function getStep1ButtonText(
  amount: BigNumber,
  max: BigNumber,
  currentAllowance: BigNumber,
  bridgeIn: boolean
): [string, boolean] {
  const bText = bridgeIn ? "bridge in" : "bridge out";
  if (currentAllowance.eq(-1)) {
    return ["select token", true];
  } else if (currentAllowance.lt(max)) {
    return ["approve", false];
  } else if (amount.isZero()) {
    return [bText, true];
  } else if (amount.gt(max)) {
    return [bText, true];
  } else {
    return [bText, false];
  }
}

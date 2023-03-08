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

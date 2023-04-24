import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { toastHandler } from "global/utils/toastHandler";
import { truncateNumber } from "global/utils/utils";
import { NativeTransaction, UserNativeToken } from "../config/interfaces";
import { TransactionHistoryEvent } from "./bridgeTxHistory";
import { getNetworkFromTokenName } from "./findTokens";
import { ReactNode } from "react";
import { Text } from "global/packages/src";

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

export function getBridgeExtraDetails(
  bridgeIn: boolean,
  native: boolean,
  from: string,
  to: string
): ReactNode {
  return (
    <Text size="text4" align="left" style={{ color: "#474747" }}>
      {native ? (
        <>
          {`by completing bridge ${
            bridgeIn ? "in" : "out"
          }, you are transferring your assets from your canto native address (${from}) to your ${
            bridgeIn
              ? "canto EVM address (" + to + ")"
              : "address on the " + to + " network"
          }. Read more about this `}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                bridgeIn
                  ? "https://docs.canto.io/user-guides/converting-assets"
                  : "https://docs.canto.io/user-guides/bridging-assets/from-canto",
                "_blank"
              )
            }
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            here.
          </a>
        </>
      ) : (
        `by bridging ${
          bridgeIn ? "in" : "out"
        }, you are transferring your assets from your ${
          bridgeIn ? "ethereum " : "canto "
        } EVM address (${from}) to your canto native address (${to}) ${
          bridgeIn ? "through gravity bridge." : "."
        }`
      )}
    </Text>
  );
}

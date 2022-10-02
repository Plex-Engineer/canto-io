import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
import { checkGravityAddress } from "pages/bridge/utils/bridgeConfirmations";
import { emptySelectedToken, UserNativeGTokens } from "../config/interfaces";

const increaseAllowanceActions = transactionStatusActions("increase allowance");
const enableActions = transactionStatusActions("enable");
const sendTokenActions = transactionStatusActions("send token");
//returns button text and if it is disabled
export function getReactiveButtonText(
  amount: BigNumber,
  token: UserNativeGTokens,
  approveStatus: TransactionState,
  cosmosStatus: TransactionState
): [string, boolean] {
  if (token.allowance.eq(-1)) {
    return ["select a token", true];
  } else if (amount.gt(token.balanceOf) && !token.allowance.isZero()) {
    return ["insufficient balance", true];
  } else if (amount.isZero() && !token.allowance.isZero()) {
    return ["enter amount", true];
  } else if (amount.gt(token.allowance) && !token.allowance.isZero()) {
    return [
      getTransactionStatusString(
        increaseAllowanceActions.action,
        increaseAllowanceActions.inAction,
        increaseAllowanceActions.postAction,
        approveStatus
      ),
      false,
    ];
  } else if (token.allowance.isZero()) {
    return [
      getTransactionStatusString(
        enableActions.action,
        enableActions.inAction,
        enableActions.postAction,
        approveStatus
      ),
      false,
    ];
  } else {
    return [
      getTransactionStatusString(
        sendTokenActions.action,
        sendTokenActions.inAction,
        sendTokenActions.postAction,
        cosmosStatus
      ),
      false,
    ];
  }
}

export function getConvertButtonText(
  amount: BigNumber,
  token: UserNativeGTokens,
  maxAmount: BigNumber,
  cantoToEVM: boolean
): [string, boolean] {
  if (token == emptySelectedToken) {
    return ["select a token", true];
  } else if (amount.isZero()) {
    return ["enter amount", true];
  } else if (amount.gt(maxAmount)) {
    return ["insufficient balance", true];
  } else {
    return [cantoToEVM ? "bridge in" : "bridge out", false];
  }
}

export function getBridgeOutButtonText(
  amount: BigNumber,
  token: UserNativeGTokens,
  maxAmount: BigNumber,
  gravityAddress: string
): [string, boolean] {
  const [text, disabled] = getConvertButtonText(
    amount,
    token,
    maxAmount,
    false
  );
  if (disabled) {
    return [text, disabled];
  } else if (!checkGravityAddress(gravityAddress)) {
    return ["invalid address", true];
  } else {
    return ["bridge out", false];
  }
}

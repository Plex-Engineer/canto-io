import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { CantoTransactionType } from "global/config/transactionTypes";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
import {
  BaseToken,
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "../config/interfaces";
import { checkGravityAddress } from "./bridgeConfirmations";

const increaseAllowanceActions = transactionStatusActions(
  CantoTransactionType.INCREASE_ALLOWANCE
);
const enableActions = transactionStatusActions(CantoTransactionType.ENABLE);
const sendTokenActions = transactionStatusActions(
  CantoTransactionType.SEND_TOKEN
);
//returns button text and if it is disabled
export function getReactiveButtonText(
  amount: BigNumber,
  token: UserGravityBridgeTokens,
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
  token: BaseToken,
  maxAmount: BigNumber,
  cantoToEVM: boolean
): [string, boolean] {
  if (token == EmptySelectedNativeToken || token == EmptySelectedConvertToken) {
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
  token: UserNativeTokens,
  maxAmount: BigNumber,
  cosmosAddress: boolean
): [string, boolean] {
  const [text, disabled] = getConvertButtonText(
    amount,
    token,
    maxAmount,
    false
  );
  if (disabled) {
    return [text, disabled];
  } else if (!cosmosAddress) {
    return ["invalid address", true];
  } else {
    return ["bridge out", false];
  }
}

import { BigNumber } from "ethers";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";

export function showText(transactionType: CantoTransactionType) {
  switch (transactionType) {
    case CantoTransactionType.SUPPLY:
      return "supply";
    case CantoTransactionType.BORROW:
      return "borrow";
    case CantoTransactionType.REPAY:
      return "repay";
    case CantoTransactionType.WITHDRAW:
      return "withdraw";
    case CantoTransactionType.ENABLE:
      return "enable";
    default:
      return "enable";
  }
}
export function getButtonText(
  BNValue: BigNumber,
  max: BigNumber,
  transactionType: CantoTransactionType
): [string, boolean] {
  if (BNValue.isZero()) {
    return ["enter amount", true];
  } else if (BNValue.gt(max)) {
    return ["insufficient balance", true];
  }
  return [showText(transactionType), false];
}

//returns text for the button, modalText, if it is disabled, and if the user needs to authorize
export function enableCollateralButtonAndModalText(
  decollateralize: boolean,
  borrowBalance: BigNumber,
  willGoOver100PercentLimit: boolean,
  willGoOver80PercentLimit: boolean,
  userConfirmed: boolean,
  tokenName: string
): [string, string, boolean, boolean] {
  if (decollateralize) {
    if (!borrowBalance.isZero()) {
      return [
        `currently borrowing ${tokenName.toLowerCase()}`,
        `you cannot uncollateralize an asset that is currently being borrowed. please repay all ${tokenName.toLowerCase()} before uncollateralizing.`,
        true,
        false,
      ];
    } else if (willGoOver100PercentLimit) {
      return [
        "100% borrow limit will be reached",
        "your total borrow limit will be used. please repay borrows or increase supply.",
        true,
        false,
      ];
    } else if (willGoOver80PercentLimit && !userConfirmed) {
      return [
        "please confirm you understand the risks",
        "80% or more of your total borrow limit will be used. please make sure you understand the risks of decollateralizing this asset.",
        true,
        true,
      ];
    } else {
      return [
        `disable ${tokenName.toLowerCase()} collateral`,
        "disabling an asset as collateral will remove it from your borrowing limit, and no longer subject it to liquidation",
        false,
        false,
      ];
    }
  }
  return [
    `enable ${tokenName.toLowerCase()} collateral`,
    "enabling an asset as collateral increases your borrowing limit, but subjects the asset to liquidation",
    false,
    false,
  ];
}

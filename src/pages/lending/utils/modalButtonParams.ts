import { BigNumber } from "ethers";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { InputState } from "../components/reactiveButton";

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
//returns text for the button and if it is disabled
export function getReactiveButtonText(
  inputState: InputState,
  transactionType: CantoTransactionType,
  amount: BigNumber,
  liquidity: BigNumber,
  borrowCap: BigNumber,
  tokenSymbol: string
): [string, boolean] {
  switch (inputState) {
    case InputState.ENABLE:
      return ["enable", false];
    case InputState.INCREASE_ALLOWANCE:
      return ["increase allowance", false];
    case InputState.ENTERAMOUNT:
      return ["enter amount", true];
    case InputState.CONFIRM:
      if (
        (transactionType == CantoTransactionType.BORROW ||
          transactionType == CantoTransactionType.WITHDRAW) &&
        liquidity.lt(amount)
      ) {
        return [`no ${tokenSymbol} left`, true];
      }
      if (
        transactionType == CantoTransactionType.BORROW &&
        borrowCap.lt(amount)
      ) {
        return ["borrow cap reached", true];
      }
      return [showText(transactionType), false];

    case InputState.NOFUNDS:
      return ["no funds", true];
    case InputState.INVALID:
      return ["enter valid value", true];
    default:
      return ["enable", false];
  }
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

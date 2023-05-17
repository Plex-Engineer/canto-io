import {
  CantoTransactionType,
  TransactionState,
} from "global/config/interfaces/transactionTypes";

export const createTransactionMessges = (
  txType: CantoTransactionType,
  tokenName?: string
) => {
  const token = tokenName ?? "token";
  switch (txType) {
    case CantoTransactionType.ENABLE:
      return {
        short: "enable",
        pending: `enabling ${token}...`,
        success: `successfully enabled ${token}`,
        error: `unable to enable ${token}`,
      };
    case CantoTransactionType.SUPPLY:
      return {
        short: "supply",
        pending: `supplying ${token}...`,
        success: `successfully supplied ${token}`,
        error: `unable to supply ${token}`,
      };
    case CantoTransactionType.BORROW:
      return {
        short: "borrow",
        pending: `borrowing ${token}...`,
        success: `successfully borrowed ${token}`,
        error: `unable to borrow ${token}`,
      };
    case CantoTransactionType.REPAY:
      return {
        short: "repay",
        pending: `repaying ${token}...`,
        success: `successfully repaid ${token}`,
        error: `unable to repay ${token}`,
      };
    case CantoTransactionType.WITHDRAW:
      return {
        short: "withdraw",
        pending: `withdrawing ${token}...`,
        success: `successfully withdrew ${token}`,
        error: `unable to withdraw ${token}`,
      };
    case CantoTransactionType.COLLATERALIZE:
      return {
        short: "collateralize",
        pending: `collateralizing ${token}...`,
        success: `successfully collateralized ${token}`,
        error: `unable to collateralize ${token}`,
      };
    case CantoTransactionType.DECOLLATERLIZE:
      return {
        short: "decollateralize",
        pending: `decollateralizing ${token}...`,
        success: `successfully decollateralized ${token}`,
        error: `unable to decollateralize ${token}`,
      };
    case CantoTransactionType.CLAIM_REWARDS:
      return {
        short: "claim rewards",
        pending: "claiming rewards...",
        success: "successfully claimed rewards",
        error: "unable to claim rewards",
      };
    case CantoTransactionType.DRIP:
      return {
        short: "drip",
        pending: "dripping...",
        success: "successfully dripped",
        error: "unable to drip",
      };
    default:
      return {
        short: "confirm",
        pending: "confirming",
        success: "confirmed",
        error: "unable to confirm",
      };
  }
};
export function getShortTxStatusFromState(state: TransactionState): string {
  switch (state) {
    case "None":
      return "complete";
    case "Mining":
      return "ongoing";
    case "PendingSignature":
      return "signing";
    case "Success":
      return "done";
    case "Exception":
    case "Fail":
      return "error";
    default:
      return "complete";
  }
}

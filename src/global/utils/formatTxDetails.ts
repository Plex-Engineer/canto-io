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
        pending: `enabling ${token}...`,
        success: `successfully enabled ${token}`,
        error: `unable to enable ${token}`,
      };
    case CantoTransactionType.SUPPLY:
      return {
        pending: `supplying ${token}...`,
        success: `successfully supplied ${token}`,
        error: `unable to supply ${token}`,
      };
    case CantoTransactionType.BORROW:
      return {
        pending: `borrowing ${token}...`,
        success: `successfully borrowed ${token}`,
        error: `unable to borrow ${token}`,
      };
    case CantoTransactionType.REPAY:
      return {
        pending: `repaying ${token}...`,
        success: `successfully repaid ${token}`,
        error: `unable to repay ${token}`,
      };
    case CantoTransactionType.WITHDRAW:
      return {
        pending: `withdrawing ${token}...`,
        success: `successfully withdrew ${token}`,
        error: `unable to withdraw ${token}`,
      };
    case CantoTransactionType.COLLATERALIZE:
      return {
        pending: `collateralizing ${token}...`,
        success: `successfully collateralized ${token}`,
        error: `unable to collateralize ${token}`,
      };
    case CantoTransactionType.DECOLLATERLIZE:
      return {
        pending: `uncollateralizing ${token}...`,
        success: `successfully uncollateralized ${token}`,
        error: `unable to uncollateralize ${token}`,
      };
    case CantoTransactionType.CLAIM_REWARDS:
      return {
        pending: "claiming rewards...",
        success: "successfully claimed rewards",
        error: "unable to claim rewards",
      };
    case CantoTransactionType.DRIP:
      return {
        pending: "dripping...",
        success: "successfully dripped",
        error: "unable to drip",
      };
    default:
      return {
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

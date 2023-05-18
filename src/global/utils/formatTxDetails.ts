import {
  CantoTransactionType,
  TransactionMessages,
  TransactionState,
} from "global/config/interfaces/transactionTypes";

export const createTransactionMessges = (
  txType: CantoTransactionType,
  tokenName?: string
): TransactionMessages => {
  const token = tokenName ?? "token";
  switch (txType) {
    //GENERAL
    case CantoTransactionType.ENABLE:
      return {
        short: "enable",
        long: `enable ${token}`,
        pending: `enabling ${token}...`,
        success: `successfully enabled ${token}`,
        error: `unable to enable ${token}`,
      };
    case CantoTransactionType.CLAIM_REWARDS_LENDING:
    case CantoTransactionType.CLAIM_REWARDS_STAKING:
      return {
        short: "claim rewards",
        long: "claim rewards",
        pending: "claiming rewards...",
        success: "successfully claimed rewards",
        error: "unable to claim rewards",
      };
    case CantoTransactionType.WRAP:
      return {
        short: "wrap",
        long: `wrap ${token}`,
        pending: `wrapping ${token}...`,
        success: `successfully wrapped ${token}`,
        error: `unable to wrap ${token}`,
      };
    case CantoTransactionType.UNWRAP:
      return {
        short: "unwrap",
        long: `unwrap ${token}`,
        pending: `unwrapping ${token}...`,
        success: `successfully unwrapped ${token}`,
        error: `unable to unwrap ${token}`,
      };
    //LENDING
    case CantoTransactionType.SUPPLY:
      return {
        short: "supply",
        long: `supply ${token}`,
        pending: `supplying ${token}...`,
        success: `successfully supplied ${token}`,
        error: `unable to supply ${token}`,
      };
    case CantoTransactionType.BORROW:
      return {
        short: "borrow",
        long: `borrow ${token}`,
        pending: `borrowing ${token}...`,
        success: `successfully borrowed ${token}`,
        error: `unable to borrow ${token}`,
      };
    case CantoTransactionType.REPAY:
      return {
        short: "repay",
        long: `repay ${token}`,
        pending: `repaying ${token}...`,
        success: `successfully repaid ${token}`,
        error: `unable to repay ${token}`,
      };
    case CantoTransactionType.WITHDRAW:
      return {
        short: "withdraw",
        long: `withdraw ${token}`,
        pending: `withdrawing ${token}...`,
        success: `successfully withdrew ${token}`,
        error: `unable to withdraw ${token}`,
      };
    case CantoTransactionType.COLLATERALIZE:
      return {
        short: "collateralize",
        long: `collateralize ${token}`,
        pending: `collateralizing ${token}...`,
        success: `successfully collateralized ${token}`,
        error: `unable to collateralize ${token}`,
      };
    case CantoTransactionType.DECOLLATERLIZE:
      return {
        short: "decollateralize",
        long: `decollateralize ${token}`,
        pending: `decollateralizing ${token}...`,
        success: `successfully decollateralized ${token}`,
        error: `unable to decollateralize ${token}`,
      };
    case CantoTransactionType.DRIP:
      return {
        short: "drip",
        long: "drip WETH",
        pending: "dripping WETH...",
        success: "successfully dripped WETH",
        error: "unable to drip WETH",
      };
    //LP
    case CantoTransactionType.ADD_LIQUIDITY:
      return {
        short: "add liquidity",
        long: `add liquidity for ${token}`,
        pending: `adding liquidity for ${token}...`,
        success: `successfully added liquidity for ${token}`,
        error: `unable to add liquidity for ${token}`,
      };
    case CantoTransactionType.REMOVE_LIQUIDITY:
      return {
        short: "remove liquidity",
        long: `remove liquidity for ${token}`,
        pending: `removing liquidity for ${token}...`,
        success: `successfully removed liquidity for ${token}`,
        error: `unable to remove liquidity for ${token}`,
      };
    //GOVERNANCE
    case CantoTransactionType.VOTING:
      return {
        short: "vote",
        long: `vote ${token}`,
        pending: `voting ${token}...}`,
        success: `successfully voted ${token}`,
        error: `unable to vote ${token}`,
      };
    //STAKING
    case CantoTransactionType.DELEGATE:
      return {
        short: "delegate",
        long: `delegate to ${token}`,
        pending: `delegating to ${token}...`,
        success: `successfully delegated to ${token}`,
        error: `unable to delegate to ${token}`,
      };
    case CantoTransactionType.UNDELEGATE:
      return {
        short: "undelegate",
        long: `undelegate from ${token}`,
        pending: `undelegating from ${token}...`,
        success: `successfully undelegated from ${token}`,
        error: `unable to undelegate from ${token}`,
      };
    case CantoTransactionType.REDELEGATE:
      return {
        short: "redelegate",
        long: `redelegate ${token}`,
        pending: `redelegating ${token}...`,
        success: `successfully redelegated ${token}`,
        error: `unable to redelegate ${token}`,
      };
    //BRIDGING
    case CantoTransactionType.SEND_TO_COSMOS:
      return {
        short: "bridge in",
        long: `bridge in ${token}...`,
        pending: `bridging ${token}...`,
        success: `successfully bridged ${token}`,
        error: `unable to bridge ${token}`,
      };
    case CantoTransactionType.CONVERT_TO_EVM:
      return {
        short: "convert to ERC20",
        long: `convert ${token} to ERC20`,
        pending: `converting ${token}...`,
        success: `successfully converted ${token}`,
        error: `unable to convert ${token}`,
      };
    case CantoTransactionType.CONVERT_TO_NATIVE:
      return {
        short: "convert to native",
        long: `convert ${token} to native`,
        pending: `converting ${token}...`,
        success: `successfully converted ${token}`,
        error: `unable to convert ${token}`,
      };
    case CantoTransactionType.IBC_OUT:
      return {
        short: "bridge out",
        long: `bridge out ${token}`,
        pending: `bridging out ${token}...`,
        success: `successfully bridged out ${token}`,
        error: `unable to bridge out ${token}`,
      };
    case CantoTransactionType.IBC_IN:
      return {
        short: "bridge in",
        long: `bridge in ${token}`,
        pending: `bridging in ${token}...`,
        success: `successfully bridged in ${token}`,
        error: `unable to bridge in ${token}`,
      };
    default:
      return {
        short: "confirm",
        long: "confirm transaction",
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

import {
  CantoTransactionType,
  TransactionMessages,
  TransactionState,
} from "global/config/interfaces/transactionTypes";

export const createTransactionMessges = (
  txType: CantoTransactionType,
  tokenName?: string,
  tokenAmount?: string
): TransactionMessages => {
  const token = tokenName ?? "token";
  const amount = tokenAmount ?? "";
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
        long: `wrap ${amount + " " + token}`,
        pending: `wrapping ${amount + " " + token}...`,
        success: `successfully wrapped ${amount + " " + token}`,
        error: `unable to wrap ${token}`,
      };
    case CantoTransactionType.UNWRAP:
      return {
        short: "unwrap",
        long: `unwrap ${amount + " " + token}`,
        pending: `unwrapping ${amount + " " + token}...`,
        success: `successfully unwrapped ${amount + " " + token}`,
        error: `unable to unwrap ${token}`,
      };
    //LENDING
    case CantoTransactionType.SUPPLY:
      return {
        short: "supply",
        long: `supply ${amount + " " + token}`,
        pending: `supplying ${amount + " " + token}...`,
        success: `successfully supplied ${amount + " " + token}`,
        error: `unable to supply ${token}`,
      };
    case CantoTransactionType.BORROW:
      return {
        short: "borrow",
        long: `borrow ${amount + " " + token}`,
        pending: `borrowing ${amount + " " + token}...`,
        success: `successfully borrowed ${amount + " " + token}`,
        error: `unable to borrow ${token}`,
      };
    case CantoTransactionType.REPAY:
      return {
        short: "repay",
        long: `repay ${amount + " " + token}`,
        pending: `repaying ${amount + " " + token}...`,
        success: `successfully repaid ${amount + " " + token}`,
        error: `unable to repay ${token}`,
      };
    case CantoTransactionType.WITHDRAW:
      return {
        short: "withdraw",
        long: `withdraw ${amount + " " + token}`,
        pending: `withdrawing ${amount + " " + token}...`,
        success: `successfully withdrew ${amount + " " + token}`,
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
        pending: `voting ${token}...`,
        success: `successfully voted ${token}`,
        error: `unable to vote ${token}`,
      };
    //STAKING
    case CantoTransactionType.DELEGATE:
      return {
        short: "delegate",
        long: `delegate ${amount + " CANTO"} to ${token}`,
        pending: `delegating ${amount + " CANTO"} to ${token}...`,
        success: `successfully delegated ${amount + " CANTO"} to ${token}`,
        error: `unable to delegate to ${token}`,
      };
    case CantoTransactionType.UNDELEGATE:
      return {
        short: "undelegate",
        long: `undelegate ${amount + " CANTO"} from ${token}`,
        pending: `undelegating ${amount + " CANTO"} from ${token}...`,
        success: `successfully ${amount + " CANTO"} undelegated from ${token}`,
        error: `unable to undelegate from ${token}`,
      };
    case CantoTransactionType.REDELEGATE:
      return {
        short: "redelegate",
        long: `redelegate ${amount + " CANTO"} ${token}`,
        pending: `redelegating ${amount + " CANTO"} ${token}...`,
        success: `successfully ${amount + " CANTO"} redelegated ${token}`,
        error: `unable to redelegate ${token}`,
      };
    //BRIDGING
    case CantoTransactionType.SEND_TO_COSMOS:
      return {
        short: "bridge in",
        long: `bridge in ${amount + " " + token}...`,
        pending: `bridging ${amount + " " + token}...`,
        success: `successfully bridged ${amount + " " + token}`,
        error: `unable to bridge ${token}`,
      };
    case CantoTransactionType.CONVERT_TO_EVM:
      return {
        short: "convert to ERC20",
        long: `convert ${amount + " " + token} to ERC20`,
        pending: `converting ${amount + " " + token}...`,
        success: `successfully converted ${amount + " " + token}`,
        error: `unable to convert ${token}`,
      };
    case CantoTransactionType.CONVERT_TO_NATIVE:
      return {
        short: "convert to native",
        long: `convert ${amount + " " + token} to native`,
        pending: `converting ${amount + " " + token}...`,
        success: `successfully converted ${amount + " " + token}`,
        error: `unable to convert ${token}`,
      };
    case CantoTransactionType.IBC_OUT:
    case CantoTransactionType.OFT_OUT:
      return {
        short: "bridge out",
        long: `bridge out ${amount + " " + token}`,
        pending: `bridging out ${amount + " " + token}...`,
        success: `successfully bridged out ${amount + " " + token}`,
        error: `unable to bridge out ${token}`,
      };
    case CantoTransactionType.IBC_IN:
    case CantoTransactionType.OFT_IN:
      return {
        short: "bridge in",
        long: `bridge in ${amount + " " + token}`,
        pending: `bridging in ${amount + " " + token}...`,
        success: `successfully bridged in ${amount + " " + token}`,
        error: `unable to bridge in ${token}`,
      };
    case CantoTransactionType.OFT_DEPOSIT:
      return {
        short: "deposit",
        long: `deposit ${amount + " " + token} into OFT`,
        pending: `depositing ${amount + " " + token} into OFT...`,
        success: `successfully deposited ${amount + " " + token}`,
        error: `unable to deposit ${token}`,
      };
    case CantoTransactionType.OFT_WITHDRAW:
      return {
        short: "withdraw",
        long: `withdraw ${amount + " " + token} from OFT`,
        pending: `withdrawing ${amount + " " + token} from OFT...`,
        success: `successfully withdrew ${amount + " " + token}`,
        error: `unable to withdraw ${token}`,
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

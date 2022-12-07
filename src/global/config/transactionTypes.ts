export enum CantoTransactionType {
  ENABLE = "Enable",
  INCREASE_ALLOWANCE = "Increase Allowance",
  SEND_TOKEN = "Send Token",
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  CLAIM_REWARDS = "Claim Rewards",
  SUPPLY = "Supply",
  WITHDRAW = "Withdraw",
  BORROW = "Borrow",
  REPAY = "Repay",
  COLLATERALIZE = "Collateralize",
  DECOLLATERLIZE = "Decollateralize",
  STAKE = "Stake",
  VOTING = "Voting",
}

//Do not change, same as useTransaction, but need for compatability with cosmos transactions
export type TransactionState =
  | "None"
  | "PendingSignature"
  | "Mining"
  | "Success"
  | "Fail"
  | "Exception";

export type TransactionActionObject = {
  action: string;
  inAction: string;
  postAction: string;
};

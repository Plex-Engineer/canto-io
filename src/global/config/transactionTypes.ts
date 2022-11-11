export enum CantoTransactionType {
  ENABLE,
  INCREASE_ALLOWANCE,
  SEND_TOKEN,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  CLAIM_REWARDS,
  SUPPLY,
  WITHDRAW,
  BORROW,
  REPAY,
  COLLATERALIZE,
  DECOLLATERLIZE,
  STAKE,
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

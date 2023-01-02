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
  BRIDGE_IN = "Bridge In",
  BRIDGE_OUT = "Bridge Out",
  CONVERT_TO_EVM = "Convert to EVM",
  CONVERT_TO_COSMOS = "Convert to Cosmos",
  BRIDGE = "Bridge",
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
export const userTxMessages = {
  waitSign: "waiting for the metamask transaction to be signed...",
  waitVerify: "waiting for the transaction to be verified...",
  deniedTx: "user denied transaction",
};

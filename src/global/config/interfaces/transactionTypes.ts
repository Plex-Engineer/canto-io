export enum CantoTransactionType {
  ENABLE = "Enable",
  //LENDING
  SUPPLY = "Supply",
  WITHDRAW = "Withdraw",
  BORROW = "Borrow",
  REPAY = "Repay",
  COLLATERALIZE = "Collateralize",
  DECOLLATERLIZE = "Decollateralize",
  DRIP = "Drip",
  CLAIM_REWARDS = "Claim Rewards",

  //LP
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  STAKE = "Stake",

  //GOVERNANCE
  VOTING = "Voting",

  INCREASE_ALLOWANCE = "Increase Allowance",
  SEND_TOKEN = "Send Token",
  BRIDGE_IN = "Bridge In",
  IBC_OUT = "IBC Out",
  CONVERT_TO_EVM = "Convert to EVM",
  CONVERT_TO_NATIVE = "Convert to Native",
  BRIDGE = "Bridge",
  IBC_IN = "IBC in",
  WRAP = "Wrap",
  UNWRAP = "Unwrap",
}

//Do not change, same as useTransaction, but need for compatability with cosmos transactions
export type TransactionState =
  | "None"
  | "PendingSignature"
  | "Mining"
  | "Success"
  | "Fail"
  | "Exception"
  | "CollectingSignaturePool";

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

interface TransactionMessages {
  pending: string;
  success: string;
  error: string;
}

export interface TransactionProps {
  txId: string;
  details: {
    type: CantoTransactionType;
    token?: {
      symbol: string;
      icon?: string;
      amount?: string;
    };
  };
  status: TransactionState;
  currentMessage: string;
  messages: TransactionMessages;
  hash?: string;
  errorReason?: string;
}

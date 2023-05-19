import { BigNumber, ContractInterface } from "ethers";
import { CosmosTxResponse } from "../cosmosConstants";

export enum CantoTransactionType {
  //GENERAL
  ENABLE = "Enable",
  WRAP = "Wrap",
  UNWRAP = "Unwrap",

  //LENDING
  SUPPLY = "Supply",
  WITHDRAW = "Withdraw",
  BORROW = "Borrow",
  REPAY = "Repay",
  COLLATERALIZE = "Collateralize",
  DECOLLATERLIZE = "Decollateralize",
  DRIP = "Drip",
  CLAIM_REWARDS_LENDING = "Claim Rewards",

  //LP
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",

  //GOVERNANCE
  VOTING = "Voting",

  //STAKING
  DELEGATE = "Delegate",
  UNDELEGATE = "Undelegate",
  REDELEGATE = "Redelegate",
  CLAIM_REWARDS_STAKING = "Claim Staking Rewards",

  //BRIDGEING
  SEND_TO_COSMOS = "Send to Cosmos",
  CONVERT_TO_EVM = "Convert to EVM",
  CONVERT_TO_NATIVE = "Convert to Native",
  IBC_OUT = "IBC Out",
  IBC_IN = "IBC in",
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

export interface TransactionDetails {
  txId: string;
  txType: CantoTransactionType;
  extra?: ExtraProps;
  status: TransactionState;
  currentMessage: string;
  messages: TransactionMessages;
  hash?: string;
  blockExplorerLink?: string;
  errorReason?: string;
}
export interface EVMTransaction {
  details?: TransactionDetails;
  address: string;
  abi: ContractInterface;
  method: string;
  params: unknown[];
  //if sending canto
  value: string | BigNumber;
  chainId?: number; // if not set, mainnet defaults are used
}
export interface CosmosTransaction {
  details?: TransactionDetails;
  chainId?: number; // if not set, mainnet defaults are used
  tx: (...args: any[]) => Promise<CosmosTxResponse>;
  params: unknown[];
}

export interface TransactionMessages {
  short: string;
  long: string;
  pending: string;
  success: string;
  error: string;
}

export interface ExtraProps {
  icon?: string;
  symbol?: string;
  readableAmount?: string;
  icon2?: string; //if LP Token
}

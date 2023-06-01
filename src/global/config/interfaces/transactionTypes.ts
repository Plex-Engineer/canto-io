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

  //BRIDGING
  SEND_TO_COSMOS = "Send to Cosmos",
  CONVERT_TO_EVM = "Convert to EVM",
  CONVERT_TO_NATIVE = "Convert to Native",
  IBC_OUT = "IBC Out",
  IBC_IN = "IBC in",

  //OFT
  OFT_OUT = "OFT out",
  OFT_IN = "OFT in",
  OFT_DEPOSIT = "OFT deposit",
  OFT_WITHDRAW = "OFT withdraw",
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
  amount?: string;
  icon2?: string; //if LP Token
}

///////////////////////////////
interface BaseTx {
  //will let the transaction store if this needs to be signed or skipped
  mustPerform?: boolean; //if not set, default is true
  chainId?: number; // if not set, mainnet defaults are used
  txType: CantoTransactionType;
  extraDetails?: ExtraProps;
}
export interface EVMTx extends BaseTx {
  address: string;
  abi: ContractInterface;
  method: string;
  params: unknown[];
  //if sending canto
  value: string | BigNumber | (() => Promise<string | BigNumber>);
}
export interface CosmosTx extends BaseTx {
  tx: (...args: any[]) => Promise<CosmosTxResponse>;
  params: unknown[];
}
export interface TransactionWithStatus {
  tx: EVMTx | CosmosTx;
  details: TransactionDetails;
}

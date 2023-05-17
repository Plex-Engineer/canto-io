import {
  CantoTransactionType,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "./transactionStore";
import { BigNumber, Contract } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { createTransactionMessges } from "global/utils/formatTxDetails";
import { ERC20Abi } from "global/config/abi";

export function createTransactionDetails(
  txStore: TransactionStore,
  txType: CantoTransactionType,
  extra?: {
    symbol?: string;
    icon?: string;
    amount?: string;
  }
): TransactionDetails {
  const transactionMessages = createTransactionMessges(txType, extra?.symbol);
  return {
    txId: txStore.generateTxId(),
    txType: txType,
    extra,
    status: "None",
    currentMessage: `awaiting signature to ${transactionMessages.short}`,
    messages: transactionMessages,
  };
}
export async function _enable(
  txStore: TransactionStore,
  contract: Contract,
  txProps: TransactionDetails,
  spender: string,
  allowance: BigNumber,
  amount: BigNumber
): Promise<boolean> {
  if (allowance.gte(amount)) {
    txStore.updateTx(txProps.txId, {
      status: "Success",
      currentMessage: txProps.messages.success,
    });
    return true;
  } else {
    return await txStore.performTx(
      async () => await contract.approve(spender, MaxUint256),
      txProps
    );
  }
}
export async function _performEnable(
  txStore: TransactionStore,
  tokenAddress: string,
  spender: string,
  currentAllowance: BigNumber,
  amountNeeded: BigNumber,
  enableDetails?: TransactionDetails
) {
  if (currentAllowance.gte(amountNeeded)) {
    if (enableDetails) {
      txStore.updateTx(enableDetails.txId, {
        status: "Success",
        currentMessage: enableDetails.messages.success,
      });
    }
    return true;
  } else {
    return await txStore.performEVMTx({
      address: tokenAddress,
      abi: ERC20Abi,
      method: "approve",
      params: [spender, MaxUint256],
      value: "0",
      details: enableDetails,
    });
  }
}

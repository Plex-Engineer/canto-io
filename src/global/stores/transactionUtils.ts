import {
  CantoTransactionType,
  EVMTx,
  ExtraProps,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "./transactionStore";
import { BigNumber } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { createTransactionMessges } from "global/utils/formatTxDetails";
import { ERC20Abi } from "global/config/abi";
import { truncateNumber } from "global/utils/formattingNumbers";

export function createTransactionDetails(
  txStore: TransactionStore,
  txType: CantoTransactionType,
  extra?: ExtraProps
): TransactionDetails {
  const transactionMessages = createTransactionMessges(
    txType,
    extra?.symbol,
    extra?.amount ? truncateNumber(extra?.amount) : undefined
  );
  return {
    txId: txStore.generateTxId(),
    txType: txType,
    extra,
    status: "None",
    currentMessage: `awaiting signature to ${transactionMessages.long}`,
    messages: transactionMessages,
  };
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

export function _enable(
  chainId: number | undefined,
  tokenAddress: string,
  spender: string,
  extraDetails?: ExtraProps
): EVMTx {
  return {
    chainId: chainId,
    txType: CantoTransactionType.ENABLE,
    address: tokenAddress,
    abi: ERC20Abi,
    method: "approve",
    params: [spender, MaxUint256],
    value: "0",
    extraDetails,
  };
}

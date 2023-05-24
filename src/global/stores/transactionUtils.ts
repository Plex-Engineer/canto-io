import {
  CantoTransactionType,
  EVMTx,
  ExtraProps,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { BigNumber } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { createTransactionMessges } from "global/utils/formatTxDetails";
import { ERC20Abi } from "global/config/abi";
import { truncateNumber } from "global/utils/formattingNumbers";

export function createTransactionDetails(
  randId: string,
  txType: CantoTransactionType,
  extra?: ExtraProps
): TransactionDetails {
  const transactionMessages = createTransactionMessges(
    txType,
    extra?.symbol,
    extra?.amount ? truncateNumber(extra?.amount) : undefined
  );
  return {
    txId: randId,
    txType: txType,
    extra,
    status: "None",
    currentMessage: `awaiting signature to ${transactionMessages.long}`,
    messages: transactionMessages,
  };
}

export function _enableTx(
  chainId: number | undefined,
  tokenAddress: string,
  spender: string,
  amount: BigNumber,
  currentAllowance: BigNumber,
  extraDetails?: ExtraProps
): EVMTx {
  return {
    mustPerform: currentAllowance.lt(amount),
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

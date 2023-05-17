import {
  CantoTransactionType,
  TransactionProps,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "./transactionStore";
import { BigNumber, Contract } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { createTransactionMessges } from "global/utils/formatTxDetails";

export function createTransactionProps(
  txStore: TransactionStore,
  txType: CantoTransactionType,
  token?: {
    symbol: string;
    icon: string;
    amount: string;
  }
): TransactionProps {
  return {
    txId: txStore.generateTxId(),
    details: {
      type: txType,
      token: token,
    },
    status: "None",
    currentMessage: "Awaiting Signature",
    messages: createTransactionMessges(txType, token?.symbol),
  };
}
export async function _enable(
  txStore: TransactionStore,
  contract: Contract,
  txProps: TransactionProps,
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

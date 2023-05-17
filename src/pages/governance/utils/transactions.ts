import { createTxMsgVote } from "@tharsis/transactions";
import { Chain, Fee } from "global/config/cosmosConstants";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import { createTransactionDetails } from "global/stores/transactionUtils";
import {
  getSenderObj,
  signAndBroadcastTxMsg,
} from "global/utils/cantoTransactions/helpers";
import { convertVoteNumberToString } from "./formattingStrings";

export async function voteTx(
  txStore: TransactionStore,
  account: string | undefined,
  proposalID: number,
  option: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string
): Promise<boolean> {
  if (!account) {
    return false;
  }
  const voteTransaction = createTransactionDetails(
    txStore,
    CantoTransactionType.VOTING,
    {
      symbol: convertVoteNumberToString(option),
      icon: "vote",
      amount: "",
    }
  );
  txStore.addTransactions([voteTransaction]);
  return await txStore.performCosmosTx(
    async () =>
      _vote(account, proposalID, option, nodeAddressIP, fee, chain, memo),
    voteTransaction
  );
}

async function _vote(
  account: string,
  proposalID: number,
  option: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string
) {
  const senderObj = await getSenderObj(account, nodeAddressIP);
  const params = {
    proposalId: proposalID,
    option,
  };
  const msg = createTxMsgVote(chain, senderObj, fee, memo, params);
  return await signAndBroadcastTxMsg(
    msg,
    senderObj,
    chain,
    nodeAddressIP,
    account
  );
}

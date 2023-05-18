import { Chain, Fee } from "global/config/cosmosConstants";
import {
  CantoTransactionType,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import { createTransactionDetails } from "global/stores/transactionUtils";
import { convertVoteNumberToString } from "./formattingStrings";
import { txVote } from "./voting";

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
    }
  );
  txStore.addTransactions([voteTransaction]);
  return await _performVote(
    txStore,
    account,
    proposalID,
    option,
    nodeAddressIP,
    fee,
    chain,
    memo,
    voteTransaction
  );
}
async function _performVote(
  txStore: TransactionStore,
  account: string,
  proposalID: number,
  option: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  voteDetails?: TransactionDetails
): Promise<boolean> {
  return await txStore.performCosmosTx({
    details: voteDetails,
    tx: txVote,
    params: [account, proposalID, option, nodeAddressIP, fee, chain, memo],
  });
}

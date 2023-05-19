import { Chain, Fee, votingFee } from "global/config/cosmosConstants";
import {
  CantoTransactionType,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import { createTransactionDetails } from "global/stores/transactionUtils";
import {
  convertToVoteNumber,
  convertVoteNumberToString,
} from "./formattingStrings";
import { txVote } from "./voting";
import { VotingOption } from "../config/interfaces";
import {
  getCosmosAPIEndpoint,
  getCosmosChainObj,
} from "global/utils/getAddressUtils";

export async function voteTx(
  txStore: TransactionStore,
  chainId: number | undefined,
  account: string | undefined,
  proposalID: number,
  option: VotingOption
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
    convertToVoteNumber(option),
    getCosmosAPIEndpoint(chainId),
    votingFee,
    getCosmosChainObj(chainId),
    "",
    voteTransaction,
    chainId
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
  voteDetails?: TransactionDetails,
  chainId?: number
): Promise<boolean> {
  return await txStore.performCosmosTx({
    details: voteDetails,
    chainId,
    tx: txVote,
    params: [account, proposalID, option, nodeAddressIP, fee, chain, memo],
  });
}

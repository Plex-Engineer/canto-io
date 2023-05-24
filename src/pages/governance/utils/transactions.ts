import { Chain, Fee, votingFee } from "global/config/cosmosConstants";
import {
  CantoTransactionType,
  CosmosTx,
  ExtraProps,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore, TxMethod } from "global/stores/transactionStore";
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
  return await txStore.addTransactionList(
    [
      _voteTx(
        chainId,
        account,
        proposalID,
        convertToVoteNumber(option),
        getCosmosAPIEndpoint(chainId),
        votingFee,
        getCosmosChainObj(chainId),
        "",
        {
          symbol: convertVoteNumberToString(option),
        }
      ),
    ],
    TxMethod.COSMOS,
    "Vote on Proposal"
  );
}
const _voteTx = (
  chainId: number | undefined,
  account: string,
  proposalID: number,
  option: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  extraDetails?: ExtraProps
): CosmosTx => ({
  chainId,
  txType: CantoTransactionType.VOTING,
  tx: txVote,
  params: [account, proposalID, option, nodeAddressIP, fee, chain, memo],
  extraDetails,
});

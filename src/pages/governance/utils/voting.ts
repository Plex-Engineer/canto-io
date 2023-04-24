import { generateEndpointProposals } from "@tharsis/provider";
import { createTxMsgVote } from "@tharsis/transactions";
import { Chain, Fee } from "global/config/cosmosConstants";
import { TransactionState } from "global/config/interfaces/transactionTypes";
import { checkCosmosTxConfirmation } from "global/utils/cantoTransactions/checkCosmosConfirmation";
import {
  ethToCanto,
  getSenderObj,
  signAndBroadcastTxMsg,
} from "global/utils/cantoTransactions/helpers";
import { VotingOption } from "../config/interfaces";

export async function voteAndSetStatus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txVote: () => Promise<any>,
  setStatus: (status: TransactionState) => void
) {
  setStatus("PendingSignature");
  let transaction;
  try {
    transaction = await txVote();
  } catch {
    setStatus("Exception");
    return;
  }
  setStatus("Mining");
  const txSuccess = await checkCosmosTxConfirmation(
    transaction.tx_response.txhash
  );
  txSuccess ? setStatus("Success") : setStatus("Fail");
}

export async function txVote(
  account: string,
  proposalID: number,
  proposalOption: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string
) {
  const senderObj = await getSenderObj(account, nodeAddressIP);
  const params = {
    proposalId: proposalID,
    option: proposalOption,
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

export async function getAccountVote(
  proposalID: string,
  nodeAddressIP: string
) {
  //@ts-ignore
  if (typeof window.ethereum !== "undefined") {
    // console.log("MetaMask is installed!");
  } else {
    console.error("Please install Metamask!");
    return VotingOption.NONE;
  }
  //@ts-ignore
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];

  const getOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const cantoAddress = await ethToCanto(account, nodeAddressIP);

  const vote = await fetch(
    nodeAddressIP +
      generateEndpointProposals() +
      "/" +
      proposalID +
      "/votes/" +
      cantoAddress,
    getOptions
  );
  const voteResponse = await vote.json();
  if (voteResponse.vote) {
    if (voteResponse.vote.option == "VOTE_OPTION_YES") {
      return VotingOption.YES;
    }
    if (voteResponse.vote.option == "VOTE_OPTION_NO") {
      return VotingOption.NO;
    }
    if (voteResponse.vote.option == "VOTE_OPTION_NO_WITH_VETO") {
      return VotingOption.VETO;
    }
    if (voteResponse.vote.option == "VOTE_OPTION_ABSTAIN") {
      return VotingOption.ABSTAIN;
    }
  }
  return VotingOption.NONE;
}

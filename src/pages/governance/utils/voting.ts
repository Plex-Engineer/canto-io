import { generateEndpointProposals } from "@tharsis/provider";
import {
  ethToCanto,
  getSenderObj,
  signAndBroadcastTxMsg,
} from "global/utils/cantoTransactions/helpers";
import { VotingOption } from "../config/interfaces";
import { Chain, Fee } from "global/config/cosmosConstants";
import { createTxMsgVote } from "@tharsis/transactions";

export async function txVote(
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

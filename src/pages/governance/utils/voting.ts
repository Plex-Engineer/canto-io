import { generateEndpointProposals } from "@tharsis/provider";
import { ethToCanto } from "global/utils/cantoTransactions/helpers";
import { VotingOption } from "../config/interfaces";

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

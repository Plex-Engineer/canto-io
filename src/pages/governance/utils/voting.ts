import { generateEndpointProposals } from "@tharsis/provider";
import { createTxMsgVote } from "@tharsis/transactions";
import { Chain, Fee } from "global/config/cosmosConstants";
import {
  ethToCanto,
  getSenderObj,
  signAndBroadcastTxMsg,
} from "global/utils/cantoTransactions/helpers";

export async function voteOnProposal(
  proposalID: number,
  proposalOption: number,
  nodeAddressIP: string,
  fee: Fee,
  chain: Chain,
  memo: string
) {
  // check metamask
  //@ts-ignore
  if (typeof window.ethereum !== "undefined") {
    // console.log("MetaMask is installed!");
  } else {
    console.error("Please install Metamask!");
    return 0;
  }

  // get metamask account address
  //@ts-ignore
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];

  // get sender object using eth address
  try {
    const senderObj = await getSenderObj(account, nodeAddressIP);
    const params = {
      proposalId: proposalID,
      option: proposalOption,
    };

    const msg = createTxMsgVote(chain, senderObj, fee, memo, params);

    await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);

    // console.log("thank you for your vote");
    return 1;
  } catch (err) {
    console.error("vote could not be placed");
    console.error(err);
    return 0;
  }
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
    return "NONE";
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
      return "yes";
    }
    if (voteResponse.vote.option == "VOTE_OPTION_NO") {
      return "no";
    }
    if (voteResponse.vote.option == "VOTE_OPTION_NO_WITH_VETO") {
      return "veto";
    }
    if (voteResponse.vote.option == "VOTE_OPTION_ABSTAIN") {
      return "abstain";
    }
  }
  return "NONE";
}

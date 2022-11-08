import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { emptyProposal } from "../config/interfaces";

export async function getSingleProposalData(id: string, chainId: number) {
  if (isNaN(Number(id))) {
    return emptyProposal;
  }
  const fetchOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const proposalData = await (
    await fetch(
      nodeURL(chainId) + "/cosmos/gov/v1beta1/proposals/" + id,
      fetchOptions
    )
  ).json();
  if (proposalData.proposal) {
    return proposalData.proposal;
  }

  return emptyProposal;
}

import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { emptyProposal, Tally } from "../config/interfaces";

const fetchOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};
export async function getSingleProposalData(id: string, chainId: number) {
  if (isNaN(Number(id))) {
    return emptyProposal;
  }
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

export async function getTotalCantoStaked(chainId: number): Promise<BigNumber> {
  const stakingData = await (
    await fetch(nodeURL(chainId) + "/cosmos/staking/v1beta1/pool", fetchOptions)
  ).json();
  return BigNumber.from(stakingData.pool?.bonded_tokens ?? 0);
}

export interface PercentVotesType {
  yes: number;
  no: number;
  veto: number;
  abstain: number;
  totalVoted: number;
}
//just in case votes are zero
const emptyPercents: PercentVotesType = {
  yes: 0,
  no: 0,
  veto: 0,
  abstain: 0,
  totalVoted: 0,
};
export function calculatePercentVotes(
  votes: Tally,
  totalStaked: BigNumber
): PercentVotesType {
  const yes = Number(formatUnits(votes.tally.yes));
  const no = Number(formatUnits(votes.tally.no));
  const abstain = Number(formatUnits(votes.tally.abstain));
  const veto = Number(formatUnits(votes.tally.no_with_veto));
  const totalVotes = yes + no + abstain + veto;
  const totalPossibleVotes = Number(formatUnits(totalStaked));

  if (totalVotes == 0) {
    return emptyPercents;
  }
  return {
    yes: yes / totalVotes,
    no: no / totalVotes,
    veto: veto / totalVotes,
    abstain: abstain / totalVotes,
    totalVoted: totalPossibleVotes == 0 ? 0 : totalVotes / totalPossibleVotes,
  };
}

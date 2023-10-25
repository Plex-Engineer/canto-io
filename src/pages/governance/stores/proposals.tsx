import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  generateEndpointProposals,
  generateEndpointProposalTally,
} from "@tharsis/provider";
import {
  emptyProposal,
  emptyTally,
  ProposalData,
  Tally,
} from "../config/interfaces";
import { getCosmosAPIEndpoint } from "global/utils/getAddressUtils";

interface ProposalProps {
  proposals: ProposalData[];
  initProposals: (chainId: number) => void;
  currentProposal: ProposalData;
  setCurrentProposal: (proposal: ProposalData) => void;
}

export const useProposals = create<ProposalProps>()(
  devtools((set, get) => ({
    proposals: [],
    initProposals: async (chainId: number) => {
      const allProposalData = await fetch(
        getCosmosAPIEndpoint(Number(chainId)) +
          generateEndpointProposals() +
          "?pagination.limit=200",
        fetchOptions
      ).then(function (response) {
        return response.json();
      });
      const allProposals = allProposalData.proposals;
      set({ proposals: allProposals });

      await allProposals.map(async (proposal: ProposalData) => {
        if (proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD") {
          const ongoingTally = await queryTally(proposal.proposal_id, chainId);
          const temp = get().proposals.filter(
            (val: ProposalData) => val.proposal_id != proposal.proposal_id
          );
          proposal.final_tally_result = { ...ongoingTally.tally };
          temp.push(proposal);
          set({ proposals: temp });
        }
      });
    },
    currentProposal: emptyProposal,
    setCurrentProposal: (proposal: ProposalData) =>
      set({ currentProposal: proposal }),
  }))
);
export async function queryTally(
  proposalID: string,
  chainId: number
): Promise<Tally> {
  const tally = await fetch(
    getCosmosAPIEndpoint(Number(chainId)) +
      generateEndpointProposalTally(proposalID),
    fetchOptions
  );
  const tallyVotes = await tally.json();
  if (tallyVotes.tally) {
    return tallyVotes;
  }
  return emptyTally;
}

const fetchOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

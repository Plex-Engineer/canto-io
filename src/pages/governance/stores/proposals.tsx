import create from "zustand";
import { devtools } from "zustand/middleware";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import {
  generateEndpointProposals,
  generateEndpointProposalTally,
} from "@tharsis/provider";
import { ProposalData, Tally } from "../config/interfaces";

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
        nodeURL(Number(chainId)) + generateEndpointProposals(),
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
    currentProposal: {
      content: {
        "@type": "none",
        description: "none",
        erc20address: "none",
        title: "none",
      },
      deposit_end_time: "000000",
      final_tally_result: {
        abstain: "0",
        no: "0",
        no_with_veto: "0",
        yes: "0",
      },
      proposal_id: "0000",
      status: "none",
      submit_time: "000000",
      total_deposit: [
        {
          amount: "0",
          denom: "aCanto",
        },
      ],
      voting_end_time: "000000",
      voting_start_time: "0000000",
    },
    setCurrentProposal: (proposal: ProposalData) =>
      set({ currentProposal: proposal }),
  }))
);

async function queryTally(proposalID: string, chainId: number): Promise<Tally> {
  const tally = await fetch(
    nodeURL(Number(chainId)) + generateEndpointProposalTally(proposalID),
    fetchOptions
  );
  return await tally.json();
}

const fetchOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

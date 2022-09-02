import create from "zustand";
import { devtools } from "zustand/middleware";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import {
  generateEndpointProposals,
  generateEndpointProposalTally,
} from "@tharsis/provider";

export interface ProposalData {
  content: {
    "@type": string;
    description: string;
    erc20address: string;
    title: string;
  };
  deposit_end_time: string;
  final_tally_result: {
    abstain: string;
    no: string;
    no_with_veto: string;
    yes: string;
  };
  proposal_id: string;
  status: string;
  submit_time: string;
  total_deposit: [
    {
      denom: string;
      amount: string;
    }
  ];
  voting_end_time: string;
  voting_start_time: string;
}

interface Tally {
  tally: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}

interface ProposalProps {
  proposals: ProposalData[];
  initProposals: (chainId: number) => void;
  currentProposal: ProposalData | undefined;
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
    currentProposal: undefined,
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

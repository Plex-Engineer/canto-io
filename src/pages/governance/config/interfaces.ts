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

export interface Tally {
  tally: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}

export const emptyProposal: ProposalData = {
  content: {
    "@type": "none",
    description: "none",
    erc20address: "none",
    title: "none",
  },
  deposit_end_time: "none",
  final_tally_result: {
    abstain: "5",
    no: "3",
    no_with_veto: "8",
    yes: "10",
  },
  proposal_id: "none",
  status: "none",
  submit_time: "none",
  total_deposit: [
    {
      denom: "none",
      amount: "none",
    },
  ],
  voting_end_time: "none",
  voting_start_time: "none",
};

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

export const emptyTally: Tally = {
  tally: {
    yes: "0",
    abstain: "0",
    no: "0",
    no_with_veto: "0",
  },
};
export const emptyProposal: ProposalData = {
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
};

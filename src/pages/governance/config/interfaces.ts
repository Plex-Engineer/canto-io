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

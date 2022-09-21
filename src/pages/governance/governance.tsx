import React, { useState, useEffect } from "react";
import Proposal from "./proposal";
import { Mixpanel } from "mixpanel";
import { useProposals } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import GovBar from "./components/govBar";
import { convertDateToString } from "./utils/formattingStrings";
import { emptyProposal, ProposalData } from "./config/interfaces";
import { GovernanceContainer } from "./components/Styled";
import { StyledPopup } from "global/components/Styled";

const Governance = () => {
  //network info store
  const networkInfo = useNetworkInfo();
  //proposal store
  const proposals = useProposals();
  //track modal click
  const [isOpen, setIsOpened] = useState(false);

  //Let the user know they are on the wrong network
  useEffect(() => {
    proposals.initProposals(Number(networkInfo.chainId));
  }, [networkInfo.chainId]);

  useEffect(() => {
    Mixpanel.events.pageOpened("governance", networkInfo.account);
  });

  function AllGovBars() {
    return (
      <React.Fragment>
        {!proposals.proposals
          ? ""
          : proposals.proposals
              .map((proposal: ProposalData) => {
                const yes = Number(proposal.final_tally_result.yes);
                const no = Number(proposal.final_tally_result.no);
                const abstain = Number(proposal.final_tally_result.abstain);
                const veto = Number(proposal.final_tally_result.no_with_veto);
                const totalVotes = yes + no + abstain + veto;
                return (
                  <GovBar
                    key={proposal.proposal_id}
                    name={proposal.content.title}
                    proposalID={proposal.proposal_id}
                    yesPecterage={
                      totalVotes == 0 ? 0 : (100 * yes) / totalVotes
                    }
                    noPecterage={totalVotes == 0 ? 0 : (100 * no) / totalVotes}
                    vetoPecterage={
                      totalVotes == 0 ? 0 : (100 * veto) / totalVotes
                    }
                    abstainPecterage={
                      totalVotes == 0 ? 0 : (100 * abstain) / totalVotes
                    }
                    startDate={convertDateToString(proposal.voting_start_time)}
                    endDate={convertDateToString(proposal.voting_end_time)}
                    status={proposal.status}
                    onClick={() => {
                      proposals.setCurrentProposal(proposal);
                      // setCurrentProposal(proposal);
                      setIsOpened(true);
                    }}
                  />
                );
              })
              .sort((a: any, b: any) => {
                return b?.props.proposalID - a?.props.proposalID;
              })}
      </React.Fragment>
    );
  }

  return (
    <GovernanceContainer>
      <div className="title subtitle">
        <a href="https://staking.canto.io/">stake</a> your canto to participate
        in governance
      </div>
      <div className="grid">
        <AllGovBars />
      </div>

      <StyledPopup
        open={isOpen}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <Proposal
          proposal={proposals.currentProposal ?? emptyProposal}
          chainId={Number(networkInfo.chainId)}
          account={networkInfo.account}
        />
      </StyledPopup>
    </GovernanceContainer>
  );
};

export default Governance;

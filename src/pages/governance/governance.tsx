import React, { useState, useEffect } from "react";
import { Mixpanel } from "mixpanel";
import { useProposals } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import GovBar from "./components/govBar";
import { convertDateToString } from "./utils/formattingStrings";
import { emptyProposal, ProposalData } from "./config/interfaces";
import { GovernanceContainer } from "./components/Styled";
import HelmetSEO from "global/components/seo";
import { DelegationResponse } from "pages/staking/config/interfaces";
import { calculateTotalStaked } from "pages/staking/utils/allUserValidatorInfo";
import { getDelegationsForAddress } from "pages/staking/utils/transactions";
import { CantoMainnet } from "global/config/networks";
import { useNavigate } from "react-router-dom";
const Governance = () => {
  //network info store
  const networkInfo = useNetworkInfo();
  //proposal store
  const proposals = useProposals();
  //track modal click
  const [isOpen, setIsOpened] = useState(false);
  const navigate = useNavigate();
  //Let the user know they are on the wrong network
  useEffect(() => {
    proposals.initProposals(Number(networkInfo.chainId));
    getTotalStake();
  }, [networkInfo.chainId, networkInfo.account]);

  useEffect(() => {
    Mixpanel.events.pageOpened("governance", networkInfo.account);
  });

  //voting power is equal to toal stake
  const [delegations, setDelegations] = useState<DelegationResponse[]>([]);
  const totalUserStake = calculateTotalStaked(delegations);
  async function getTotalStake() {
    if (networkInfo.account) {
      setDelegations(
        await getDelegationsForAddress(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.account
        )
      );
    }
  }
  function AllGovBars() {
    return (
      <>
        <HelmetSEO
          title="Canto - Governance"
          description="A test message written for Governance only"
          link="governance"
        />
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
                      navigate("proposal/" + proposal.proposal_id);
                      // setCurrentProposal(proposal);
                      setIsOpened(true);
                    }}
                  />
                );
              })
              .sort((a: any, b: any) => {
                return b?.props.proposalID - a?.props.proposalID;
              })}
      </>
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

      {/* <StyledPopup
        open={isOpen}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <Proposal />
      </StyledPopup> */}
    </GovernanceContainer>
  );
};

export default Governance;

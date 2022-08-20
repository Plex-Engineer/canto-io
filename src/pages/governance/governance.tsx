import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import Proposal from "./proposal";
import { Mixpanel } from "mixpanel";
import { ProposalData, useProposals } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import GovBar from "./components/govBar";
import { convertDateToString } from "./utils/formattingStrings";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 1200px;
  margin: 0 auto 3rem auto;
  .title {
    font-weight: 300;
    font-size: 140px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
    margin-top: 4rem;
    margin-bottom: 2rem;
  }

  .subtitle {
    margin: 0;
    margin-bottom: 5rem;
    a {
      color: var(--primary-color);
    }
    margin-top: 40px;
    text-shadow: none;
    color: white;
    text-align: center;
    font-size: 35px;
    font-weight: 400;
  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: 0.6rem 2.4rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-top: 2rem;

    margin-bottom: 3rem;

    &:hover {
      background-color: var(--primary-color-dark);
      cursor: pointer;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    column-gap: 0.8rem;
  }
`;
const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;
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
    Mixpanel.events.pageOpened("governance", networkInfo.account)
  })

  const emptyProposal: ProposalData = {
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

  function AllGovBars() {
    return (
      <React.Fragment>
        {!proposals.proposals
          ? ""
          : proposals.proposals
              .map((proposal: ProposalData) => {
                let yes = Number(proposal.final_tally_result.yes);
                let no = Number(proposal.final_tally_result.no);
                let abstain = Number(proposal.final_tally_result.abstain);
                let veto = Number(proposal.final_tally_result.no_with_veto);
                let totalVotes = yes + no + abstain + veto;
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
    <Container>
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
    </Container>
  );
};

export default Governance;

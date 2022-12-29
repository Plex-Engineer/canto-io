import { useEffect } from "react";
import { Mixpanel } from "mixpanel";
import { useProposals } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import GovBar from "./components/govBar";
import { convertDateToString } from "./utils/formattingStrings";
import { ProposalData } from "./config/interfaces";
import { GovernanceContainer } from "./components/Styled";
import HelmetSEO from "global/components/seo";
import { useNavigate } from "react-router-dom";
import { Text } from "global/packages/src";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
const Governance = () => {
  //network info store
  const networkInfo = useNetworkInfo();
  //proposal store
  const proposals = useProposals();
  const navigate = useNavigate();
  useEffect(() => {
    proposals.initProposals(Number(networkInfo.chainId));
  }, [networkInfo.chainId]);

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
                    }}
                  />
                );
              })
              .sort((a: ReactJSXElement, b: ReactJSXElement) => {
                return b?.props.proposalID - a?.props.proposalID;
              })}
      </>
    );
  }

  return (
    <GovernanceContainer>
      <Text
        size="title2"
        type="title"
        color="white"
        style={{
          margin: "3rem 1rem",
        }}
      >
        <a
          style={{
            fontFamily: "Silkscreen",
            textDecoration: "underline",
          }}
          href="/staking"
          onClick={() => Mixpanel.events.governanceActions.openedStakingPage()}
        >
          stake
        </a>{" "}
        your canto to participate in governance
      </Text>
      <div className="grid">
        <AllGovBars />
      </div>
    </GovernanceContainer>
  );
};

export default Governance;

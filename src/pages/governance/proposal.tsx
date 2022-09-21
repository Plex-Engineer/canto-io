import { memo, votingFee } from "global/config/cosmosConstants";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { useEffect } from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import CheckBox from "./components/checkBox";
import { GraphBar } from "./components/govBar";
import { votingThresholds } from "./config/votingThresholds";
import {
  convertDateToString,
  convertToVoteNumber,
} from "./utils/formattingStrings";
import { getAccountVote, voteOnProposal } from "./utils/voting";
import { ProposalData } from "./config/interfaces";
import { PrimaryButton } from "cantoui";

const Container = styled.div`
  overflow-wrap: break-word;
  padding: 2rem;
  display: flex;
  height: 90vh;
  max-height: 45.6rem;
  width: 500px;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  overflow-y: scroll;
  scrollbar-color: var(--primary-color);
  scroll-behavior: smooth;
  /* width */

  .title {
    font-weight: 300;
    font-size: 184px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
  }
  .rowCell {
    p:first-child {
      text-transform: lowercase;
      color: #888;
    }
    p:last-child {
      color: white;
    }
  }
  .tiny {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    justify-content: space-between;
    letter-spacing: -0.03em;

    color: #878787;
  }
  h1 {
    font-weight: 300;
    font-size: 22px;
    line-height: 130%;
    /* identical to box height, or 29px */

    text-align: left;
    letter-spacing: -0.1em;

    /* almost white */

    color: #efefef;
  }
  /* & > button {
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
  } */
`;

interface ProposalWithChain {
  proposal: ProposalData;
  chainId: number | undefined;
  account: string | undefined;
}

const Proposal = (props: ProposalWithChain) => {
  const yes = Number(props.proposal.final_tally_result.yes);
  const no = Number(props.proposal.final_tally_result.no);
  const abstain = Number(props.proposal.final_tally_result.abstain);
  const veto = Number(props.proposal.final_tally_result.no_with_veto);
  const totalVotes = yes + no + abstain + veto;

  const [accountVote, setAccountVote] = useState("NONE");
  const [voteSuccess, setVoteSuccess] = useState<number | undefined>(undefined);
  async function showAccountVote() {
    if (props.proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD") {
      const vote = await getAccountVote(
        props.proposal.proposal_id,
        nodeURL(props.chainId)
      );
      setAccountVote(vote);
    }
  }
  useEffect(() => {
    showAccountVote();
  }, []);

  const chain = {
    chainId: props.chainId ?? 0,
    cosmosChainId: `canto_${props.chainId}-1`,
  };

  const [voteOption, setVoteOption] = useState("none");
  const voteEnded = props.proposal.status != "PROPOSAL_STATUS_VOTING_PERIOD";
  return (
    <Container>
      <button
        style={{
          display: "none",
        }}
      >
        to stop auto focus
      </button>
      <div className="tiny">
        {" "}
        <p>governance / {props.proposal.proposal_id}</p>
        <p>
          {!voteEnded
            ? "Voting"
            : props.proposal.status == "PROPOSAL_STATUS_PASSED"
            ? "Passed"
            : "Rejected"}
        </p>
      </div>
      <h1>{props.proposal.content.title}</h1>
      <RowCell
        type="Type:"
        value={props.proposal.content["@type"].slice(
          props.proposal.content["@type"].lastIndexOf(".") + 1
        )}
      />
      <div
        className="rowCell"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "green",
        }}
      >
        <p>Description</p>
        <p>{props.proposal.content.description}</p>
      </div>

      <RowCell
        color="#06fc99"
        type="Yes:"
        value={props.proposal.final_tally_result.yes.toString()}
      />
      <RowCell
        color="#ff4646"
        type="No:"
        value={props.proposal.final_tally_result.no.toString()}
      />
      <RowCell
        color="#710808"
        type="No With Veto:"
        value={props.proposal.final_tally_result.no_with_veto.toString()}
      />
      <RowCell
        color="#fbea51"
        type="Abstain:"
        value={props.proposal.final_tally_result.abstain.toString()}
      />

      <RowCell
        type="TOTAL DEPOSIT:"
        value={
          props.proposal.total_deposit[0].amount +
          " " +
          props.proposal.total_deposit[0].denom
        }
      />
      <RowCell
        type="SUBMIT TIME:"
        value={convertDateToString(props.proposal.submit_time)}
      />
      <RowCell
        type="VOTING END TIME:"
        value={convertDateToString(props.proposal.voting_end_time)}
      />
      <RowCell
        type="DEPOSIT END TIME:"
        value={convertDateToString(props.proposal.deposit_end_time)}
      />
      <RowCell type="QUORUM:" value={votingThresholds.quorum} />
      <RowCell type="THRESHOLD:" value={votingThresholds.threshold} />
      <RowCell type="VETO THRESHOLD:" value={votingThresholds.veto} />
      {accountVote != "NONE" ? (
        <p style={{ color: "white" }}>
          YOUR VOTE:{" "}
          <a
            style={
              accountVote == "YES"
                ? { color: "#06fc99" }
                : accountVote == "NO"
                ? { color: "#ff4646" }
                : accountVote == "VETO"
                ? { color: "#710808" }
                : { color: "#fbea51" }
            }
          >
            {accountVote}
          </a>
        </p>
      ) : (
        ""
      )}
      {voteSuccess == 0 ? (
        <div style={{ color: "red" }}>vote could not be placed</div>
      ) : voteSuccess == 1 ? (
        <div style={{ color: "green" }}>thank you for your vote!</div>
      ) : (
        ""
      )}

      <CheckBox
        values={!voteEnded ? ["yes", "no", "veto", "abstain"] : []}
        onChange={setVoteOption}
      />
      <PrimaryButton
        disabled={voteEnded}
        onClick={async () => {
          const voteSuccess = await voteOnProposal(
            Number(props.proposal.proposal_id),
            convertToVoteNumber(voteOption),
            nodeURL(props.chainId),
            votingFee,
            chain,
            memo
          );
          setVoteSuccess(voteSuccess);
        }}
        autoFocus={false}
      >
        {voteEnded
          ? "voting has ended"
          : voteOption == "none"
          ? "select an option"
          : "vote"}
      </PrimaryButton>

      <GraphBar
        yesPecterage={totalVotes == 0 ? 0 : (100 * yes) / totalVotes}
        noPecterage={totalVotes == 0 ? 0 : (100 * no) / totalVotes}
        vetoPecterage={totalVotes == 0 ? 0 : (100 * veto) / totalVotes}
        abstainPecterage={totalVotes == 0 ? 0 : (100 * abstain) / totalVotes}
      />
    </Container>
  );
};

interface Props {
  type: string;
  value?: string;
  color?: string;
}
const RowCell = (props: Props) => {
  return (
    <div
      className="rowCell"
      style={{
        display: "flex",
        justifyContent: "space-between",
        color: "green",
      }}
    >
      <p
        style={{
          color: props.color ?? "#888",
        }}
      >
        {props.type}
      </p>
      <p>{props.value}</p>
    </div>
  );
};

export default Proposal;

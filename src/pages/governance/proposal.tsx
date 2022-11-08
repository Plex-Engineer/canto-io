import { memo, votingFee } from "global/config/cosmosConstants";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { useEffect } from "react";
import { useState } from "react";
import CheckBox from "./components/checkBox";
import { GraphBar } from "./components/govBar";
import { votingThresholds } from "./config/votingThresholds";
import {
  convertDateToString,
  convertToVoteNumber,
} from "./utils/formattingStrings";
import { getAccountVote, voteOnProposal } from "./utils/voting";
import { ProposalData } from "./config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import { ProposalContainer } from "./components/Styled";
import { formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { useProposals } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import { PieChart } from "react-minimal-pie-chart";
import Popup from "reactjs-popup";
interface ProposalWithChain {
  proposal: ProposalData;
  chainId: number | undefined;
  account: string | undefined;
}

const Proposal = () => {
  const proposal = useProposals().currentProposal;
  const chainId = Number(useNetworkInfo().chainId);

  const yes = Number(proposal.final_tally_result.yes);
  const no = Number(proposal.final_tally_result.no);
  const abstain = Number(proposal.final_tally_result.abstain);
  const veto = Number(proposal.final_tally_result.no_with_veto);
  const totalVotes = yes + no + abstain + veto;
  const [accountVote, setAccountVote] = useState("NONE");
  const [voteSuccess, setVoteSuccess] = useState<number | undefined>(undefined);
  async function showAccountVote() {
    if (proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD") {
      const vote = await getAccountVote(proposal.proposal_id, nodeURL(chainId));
      setAccountVote(vote);
    }
  }
  useEffect(() => {
    showAccountVote();
  }, []);

  const chain = {
    chainId: chainId ?? 0,
    cosmosChainId: `canto_${chainId}-1`,
  };

  const [voteOption, setVoteOption] = useState("none");
  const voteEnded = proposal.status != "PROPOSAL_STATUS_VOTING_PERIOD";
  return (
    <ProposalContainer>
      <div className="details">
        <button
          style={{
            display: "none",
          }}
        >
          to stop auto focus
        </button>
        <div className="tiny">
          {" "}
          <p>governance / {proposal.proposal_id}</p>
          <p>
            {!voteEnded
              ? "Voting"
              : proposal.status == "PROPOSAL_STATUS_PASSED"
              ? "Passed"
              : "Rejected"}
          </p>
        </div>
        <h1>{proposal.content.title}</h1>
        <RowCell
          type="Type:"
          value={proposal.content["@type"].slice(
            proposal.content["@type"].lastIndexOf(".") + 1
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
          <p>{proposal.content.description}</p>
        </div>
        <RowCell
          color="#06fc99"
          type="Yes:"
          value={truncateNumber(formatUnits(proposal.final_tally_result.yes))}
        />
        <RowCell
          color="#ff4646"
          type="No:"
          value={truncateNumber(formatUnits(proposal.final_tally_result.no))}
        />
        <RowCell
          color="#710808"
          type="No With Veto:"
          value={truncateNumber(
            formatUnits(proposal.final_tally_result.no_with_veto)
          )}
        />
        <RowCell
          color="#fbea51"
          type="Abstain:"
          value={truncateNumber(
            formatUnits(proposal.final_tally_result.abstain)
          )}
        />
        <RowCell
          type="TOTAL DEPOSIT:"
          value={
            truncateNumber(formatUnits(proposal.total_deposit[0].amount)) +
            " canto"
          }
        />
        <RowCell
          type="SUBMIT TIME:"
          value={convertDateToString(proposal.submit_time)}
        />
        <RowCell
          type="VOTING END TIME:"
          value={convertDateToString(proposal.voting_end_time)}
        />
        <RowCell
          type="DEPOSIT END TIME:"
          value={convertDateToString(proposal.deposit_end_time)}
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
      </div>

      <div className="pie">
        <PieChart
          lineWidth={6}
          data={[
            {
              title: "yes",
              value: totalVotes == 0 ? 0 : (1000 * yes) / totalVotes,
              color: "#06fc99",
            },
            {
              title: "no",
              value: totalVotes == 0 ? 0 : (1000 * no) / totalVotes,
              color: "#ff4646",
            },
            {
              title: "veto",
              value: totalVotes == 0 ? 0 : (1000 * veto) / totalVotes,
              color: "#710808",
            },
            {
              title: "abstain",
              value: totalVotes == 0 ? 0 : (1000 * abstain) / totalVotes,
              color: "#fbea51",
            },
          ]}
        >
          <Text size="text1" type="text">
            test
          </Text>
        </PieChart>
        <PrimaryButton autoFocus={false}>test</PrimaryButton>
        <PrimaryButton
          disabled={voteEnded}
          onClick={async () => {
            const voteSuccess = await voteOnProposal(
              Number(proposal.proposal_id),
              convertToVoteNumber(voteOption),
              nodeURL(chainId),
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
      </div>
    </ProposalContainer>
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

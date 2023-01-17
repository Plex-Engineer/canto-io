import { votingThresholds } from "./config/votingThresholds";
import {
  convertDateToString,
  convertVoteNumberToString,
} from "./utils/formattingStrings";
import { VoteStatus, VotingOption } from "./config/interfaces";
import { PrimaryButton } from "global/packages/src";
import { ProposalContainer } from "./components/Styled";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import Popup from "reactjs-popup";
import GovModal from "./components/govModal";
import { formatBigNumber } from "global/packages/src/utils/formatNumbers";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import GBar from "./components/gBar";
import { useSingleProposalData } from "./hooks/useSingleProposalData";
import { useState } from "react";
const Proposal = () => {
  const {
    proposalId,
    proposalFound,
    proposal,
    voteEnded,
    voteData,
    userVoteData,
    customizeData,
    votingFuncionality,
  } = useSingleProposalData();
  const [votingOpen, setVotingOpen] = useState(false);

  if (!proposalFound) {
    return (
      <ProposalContainer>
        <div>{`proposal id "${proposalId}" not found`}</div>
      </ProposalContainer>
    );
  }

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
              : proposal.status == VoteStatus.passed
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
        <div
          role={"button"}
          tabIndex={0}
          className="details"
          onClick={() =>
            customizeData.setShowPercentVote(!customizeData.showPercentVote)
          }
          style={{ cursor: "pointer", width: "100%" }}
        >
          <RowCell
            color="#06fc99"
            type="Yes:"
            value={
              customizeData.showPercentVote
                ? truncateNumber((voteData.percents.yes * 100).toString()) + "%"
                : truncateNumber(formatUnits(voteData.currentTally.tally.yes)) +
                  " canto"
            }
          />
          <RowCell
            color="#ff4646"
            type="No:"
            value={
              customizeData.showPercentVote
                ? truncateNumber((voteData.percents.no * 100).toString()) + "%"
                : truncateNumber(formatUnits(voteData.currentTally.tally.no)) +
                  " canto"
            }
          />
          <RowCell
            color="#710808"
            type="No With Veto:"
            value={
              customizeData.showPercentVote
                ? truncateNumber((voteData.percents.veto * 100).toString()) +
                  "%"
                : truncateNumber(
                    formatUnits(voteData.currentTally.tally.no_with_veto)
                  ) + " canto"
            }
          />
          <RowCell
            color="#fbea51"
            type="Abstain:"
            value={
              customizeData.showPercentVote
                ? truncateNumber((voteData.percents.abstain * 100).toString()) +
                  "%"
                : truncateNumber(
                    formatUnits(voteData.currentTally.tally.abstain)
                  ) + " canto"
            }
          />
        </div>
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
      </div>

      <div className="voting">
        <GBar
          yes={voteData.percents.yes * 100}
          no={voteData.percents.no * 100}
          veto={voteData.percents.veto * 100}
          abstain={voteData.percents.abstain * 100}
          totalVotes={voteData.percents.totalVoted * 100}
          quorum={Number.parseFloat(votingThresholds.quorum)}
          vetoThreshold={Number.parseFloat(votingThresholds.veto)}
          threshold={Number.parseFloat(votingThresholds.threshold)}
        />
        <div className="voting-wrapper">
          <PrimaryButton
            disabled={voteEnded}
            autoFocus={false}
            onClick={() => {
              setVotingOpen(true);
            }}
          >
            {voteEnded ? "voting ended" : "vote"}
          </PrimaryButton>
          <Popup
            overlayStyle={{
              backgroundColor: "#1f4a2c6e",
              backdropFilter: "blur(2px)",
            }}
            lockScroll
            open={votingOpen}
            modal
            onClose={() => votingFuncionality.resetVote()}
          >
            {
              <div>
                {votingFuncionality.voteStatus != "None" && (
                  <GlobalLoadingModal
                    transactionType={CantoTransactionType.VOTING}
                    status={votingFuncionality.voteStatus}
                    tokenName={convertVoteNumberToString(
                      votingFuncionality.castingVote
                    )}
                    onClose={() => votingFuncionality.resetVote()}
                    mixPanelEventInfo={{
                      proposalId: proposal.proposal_id,
                      vote: convertVoteNumberToString(
                        votingFuncionality.castingVote
                      ),
                    }}
                  />
                )}
                <GovModal
                  onVote={votingFuncionality.txVote}
                  onClose={() => setVotingOpen(false)}
                  proposal={proposal}
                  currentVote={userVoteData.currentVote}
                />
              </div>
            }
          </Popup>
          {userVoteData.currentVote != VotingOption.NONE ? (
            <p style={{ color: "white" }}>
              YOUR VOTE:{" "}
              <a
                style={
                  userVoteData.currentVote == VotingOption.YES
                    ? { color: "#06fc99" }
                    : userVoteData.currentVote == VotingOption.NO
                    ? { color: "#ff4646" }
                    : userVoteData.currentVote == VotingOption.VETO
                    ? { color: "#710808" }
                    : { color: "#fbea51" }
                }
              >
                {convertVoteNumberToString(
                  userVoteData.currentVote
                ).toUpperCase()}
              </a>
            </p>
          ) : (
            ""
          )}
          {voteEnded
            ? ""
            : `voting power: ${
                customizeData.showPercentVote
                  ? truncateNumber(
                      (100 * userVoteData.votingPowerPercent).toString()
                    ) + "%"
                  : truncateNumber(formatEther(userVoteData.votingPower)) +
                    " canto"
              }`}
          {votingFuncionality.voteStatus == "Success" && (
            <div style={{ color: "green" }}>thank you for your vote!</div>
          )}
        </div>
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

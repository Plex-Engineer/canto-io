import { memo, votingFee } from "global/config/cosmosConstants";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { useEffect } from "react";
import { useState } from "react";
import { votingThresholds } from "./config/votingThresholds";
import {
  convertDateToString,
  convertToVoteNumber,
  convertVoteNumberToString,
} from "./utils/formattingStrings";
import { getAccountVote, voteOnProposal } from "./utils/voting";
import {
  emptyProposal,
  emptyTally,
  ProposalData,
  Tally,
  VoteStatus,
  VotingOption,
} from "./config/interfaces";
import { PrimaryButton } from "global/packages/src";
import { ProposalContainer } from "./components/Styled";
import { formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { queryTally } from "./stores/proposals";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useParams } from "react-router-dom";
import { getSingleProposalData } from "./utils/proposalUtils";
import { PieChart } from "react-minimal-pie-chart";
import Popup from "reactjs-popup";
import GovModal from "./components/govModal";
import { DelegationResponse } from "pages/staking/config/interfaces";
import { getDelegationsForAddress } from "pages/staking/utils/transactions";
import { CantoMainnet } from "global/config/networks";
import { calculateTotalStaked } from "pages/staking/utils/allUserValidatorInfo";
import { formatBigNumber } from "global/packages/src/utils/formatNumbers";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import {
  CantoTransactionType,
  TransactionState,
} from "global/config/transactionTypes";
const Proposal = () => {
  const [chainId, account] = useNetworkInfo((state) => [
    Number(state.chainId),
    state.account,
  ]);

  //voting power is equal to toal stake
  const [delegations, setDelegations] = useState<DelegationResponse[]>([]);
  const totalUserStake = formatUnits(calculateTotalStaked(delegations));
  async function getTotalStake() {
    if (account) {
      setDelegations(
        await getDelegationsForAddress(CantoMainnet.cosmosAPIEndpoint, account)
      );
    }
  }
  useEffect(() => {
    getTotalStake();
  }, [account]);

  //will show the votes in percent or total votes format
  const [showPercentVote, setShowPercentVote] = useState(true);
  //this will contain the proposal id
  const { id } = useParams();
  const [currentVotes, setCurrentVotes] = useState<Tally>(emptyTally);
  const [proposal, setProposal] = useState<ProposalData>(emptyProposal);
  async function getProposalData() {
    setProposal(await getSingleProposalData(id ?? "0", chainId));
    setCurrentVotes(await queryTally(id ?? "0", chainId));
  }

  const yes = Number(formatUnits(currentVotes.tally.yes));
  const no = Number(formatUnits(currentVotes.tally.no));
  const abstain = Number(formatUnits(currentVotes.tally.abstain));
  const veto = Number(formatUnits(currentVotes.tally.no_with_veto));
  const totalVotes = yes + no + abstain + veto;
  const [accountVote, setAccountVote] = useState(VotingOption.NONE);
  const [voteSuccess, setVoteSuccess] = useState<number | undefined>(undefined);
  async function showAccountVote() {
    if (proposal.status == VoteStatus.votingOngoing) {
      const vote = await getAccountVote(proposal.proposal_id, nodeURL(chainId));
      setAccountVote(vote);
    }
  }
  useEffect(() => {
    showAccountVote();
    getProposalData();
  }, []);
  const chain = {
    chainId: chainId ?? 0,
    cosmosChainId: `canto_${chainId}-1`,
  };

  const voteEnded = proposal.status != VoteStatus.votingOngoing;

  const [castingVote, setCastingVote] = useState<VotingOption>(
    VotingOption.NONE
  );
  const [voteStatus, setVoteStatus] = useState<TransactionState>("None");

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
          onClick={() => setShowPercentVote(!showPercentVote)}
          style={{ cursor: "pointer", width: "100%" }}
        >
          <RowCell
            color="#06fc99"
            type="Yes:"
            value={
              showPercentVote
                ? totalVotes
                  ? truncateNumber(((yes * 100) / totalVotes).toString()) + "%"
                  : "0%"
                : truncateNumber(yes.toString()) + " canto"
            }
          />
          <RowCell
            color="#ff4646"
            type="No:"
            value={
              showPercentVote
                ? totalVotes
                  ? truncateNumber(((no * 100) / totalVotes).toString()) + "%"
                  : "0%"
                : truncateNumber(no.toString()) + " canto"
            }
          />
          <RowCell
            color="#710808"
            type="No With Veto:"
            value={
              showPercentVote
                ? totalVotes
                  ? truncateNumber(((veto * 100) / totalVotes).toString()) + "%"
                  : "0%"
                : truncateNumber(veto.toString()) + " canto"
            }
          />
          <RowCell
            color="#fbea51"
            type="Abstain:"
            value={
              showPercentVote
                ? totalVotes
                  ? truncateNumber(((abstain * 100) / totalVotes).toString()) +
                    "%"
                  : "0%"
                : truncateNumber(abstain.toString()) + " canto"
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
        <PieChart
          className="pie"
          animationDuration={500}
          animationEasing="ease-out"
          lineWidth={10}
          totalValue={totalVotes}
          label={({ dataEntry }) => {
            if (Math.round(dataEntry.percentage) == 0) {
              return "";
            }
            return `${Math.round(dataEntry.percentage)} %`;
          }}
          labelStyle={{
            accentColor: "#ffffff",
            color: "#ffffff",
            colorScheme: "dark",
          }}
          data={[
            {
              title: "yes",
              value: yes,
              color: "#06fc99",
            },
            {
              title: "no",
              value: no,
              color: "#ff4646",
            },
            {
              title: "veto",
              value: veto,
              color: "#710808",
            },
            {
              title: "abstain",
              value: abstain,
              color: "#fbea51",
            },
          ]}
        />
        <Popup
          overlayStyle={{
            background: "rgba(32, 32, 32, 0.4)",
            backdropFilter: "blur(35px)",
          }}
          trigger={
            <PrimaryButton disabled={voteEnded} autoFocus={false}>
              {voteEnded ? "voting has ended" : "vote"}
            </PrimaryButton>
          }
          modal={true}
          onClose={() => {
            setCastingVote(VotingOption.NONE);
            setVoteStatus("None");
          }}
        >
          {
            <div>
              {voteStatus != "None" && (
                <GlobalLoadingModal
                  transactionType={CantoTransactionType.VOTING}
                  status={voteStatus}
                  tokenName={convertVoteNumberToString(castingVote)}
                  onClose={() => {
                    setCastingVote(VotingOption.NONE);
                    setVoteStatus("None");
                  }}
                />
              )}
              <GovModal
                onVote={async (vote: VotingOption) => {
                  setVoteStatus("PendingSignature");
                  setCastingVote(vote);
                  const voteSuccess = await voteOnProposal(
                    Number(proposal.proposal_id),
                    convertToVoteNumber(vote),
                    nodeURL(chainId),
                    votingFee,
                    chain,
                    memo
                  );
                  setVoteSuccess(voteSuccess);
                  if (voteSuccess) {
                    setVoteStatus("Success");
                  } else {
                    setVoteStatus("Fail");
                  }
                }}
                proposal={proposal}
                currentVote={accountVote}
              />
            </div>
          }
        </Popup>
        {accountVote != VotingOption.NONE ? (
          <p style={{ color: "white" }}>
            YOUR VOTE:{" "}
            <a
              style={
                accountVote == VotingOption.YES
                  ? { color: "#06fc99" }
                  : accountVote == VotingOption.NO
                  ? { color: "#ff4646" }
                  : accountVote == VotingOption.VETO
                  ? { color: "#710808" }
                  : { color: "#fbea51" }
              }
            >
              {convertVoteNumberToString(accountVote).toUpperCase()}
            </a>
          </p>
        ) : (
          ""
        )}
        {voteEnded
          ? ""
          : `voting power: ${
              showPercentVote
                ? totalVotes == 0
                  ? "100%"
                  : truncateNumber(
                      (100 * (Number(totalUserStake) / totalVotes)).toString()
                    ) + "%"
                : formatBigNumber(totalUserStake) + " canto"
            }`}
        {voteSuccess == 0 ? (
          <div style={{ color: "red" }}>vote could not be placed</div>
        ) : voteSuccess == 1 ? (
          <div style={{ color: "green" }}>thank you for your vote!</div>
        ) : (
          ""
        )}
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

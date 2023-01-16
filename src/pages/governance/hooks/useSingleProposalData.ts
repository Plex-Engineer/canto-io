import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { chain, memo, votingFee } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import { TransactionState } from "global/config/transactionTypes";
import { useNetworkInfo } from "global/stores/networkInfo";
import { nodeURL } from "global/utils/cantoTransactions/helpers";
import { Mixpanel } from "mixpanel";
import { DelegationResponse } from "pages/staking/config/interfaces";
import { calculateTotalStaked } from "pages/staking/utils/allUserValidatorInfo";
import { getDelegationsForAddress } from "pages/staking/utils/transactions";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  emptyProposal,
  emptyTally,
  ProposalData,
  Tally,
  VoteStatus,
  VotingOption,
} from "../config/interfaces";
import { queryTally } from "../stores/proposals";
import { convertToVoteNumber } from "../utils/formattingStrings";
import {
  calculatePercentVotes,
  getSingleProposalData,
  getTotalCantoStaked,
  PercentVotesType,
} from "../utils/proposalUtils";
import { getAccountVote, txVote, voteAndSetStatus } from "../utils/voting";

interface SingleProposalReturnProps {
  proposalId?: string;
  proposalFound: boolean;
  proposal: ProposalData;
  voteEnded: boolean;
  voteData: {
    currentTally: Tally;
    percents: PercentVotesType;
  };
  userVoteData: {
    currentVote: VotingOption;
    votingPower: string;
    votingPowerPercent: number;
  };
  customizeData: {
    showPercentVote: boolean;
    setShowPercentVote: (show: boolean) => void;
  };
  votingFuncionality: {
    voteStatus: TransactionState;
    castingVote: VotingOption;
    txVote: (vote: VotingOption) => void;
    resetVote: () => void;
  };
}
export function useSingleProposalData(): SingleProposalReturnProps {
  const [chainId, account] = useNetworkInfo((state) => [
    Number(state.chainId),
    state.account,
  ]);

  //voting power is equal to toal stake
  const [delegations, setDelegations] = useState<DelegationResponse[]>([]);
  const totalUserStake = calculateTotalStaked(delegations);
  const [totalGlobalStake, setTotalGlobalStake] = useState(BigNumber.from(0));

  async function getUserDelegations() {
    if (account) {
      setDelegations(
        await getDelegationsForAddress(CantoMainnet.cosmosAPIEndpoint, account)
      );
    }
  }
  //get delegations when account changes
  useEffect(() => {
    getUserDelegations();
  }, [account]);

  //will show the votes in percent or total votes format
  const [showPercentVote, setShowPercentVote] = useState(true);
  //this will contain the proposal id
  const { id } = useParams();
  //will tell us if the id relates to a real proposal
  const [proposalFound, setProposalFound] = useState(true);

  const [currentVotes, setCurrentVotes] = useState<Tally>(emptyTally);
  const [proposal, setProposal] = useState<ProposalData>(emptyProposal);
  async function getProposalData() {
    const singleProposal = await getSingleProposalData(id ?? "0", chainId);
    setProposal(singleProposal);
    setCurrentVotes(await queryTally(id ?? "0", chainId));
    if (singleProposal == emptyProposal) {
      setProposalFound(false);
    }
    setTotalGlobalStake(await getTotalCantoStaked(chainId));
  }
  const [accountVote, setAccountVote] = useState(VotingOption.NONE);
  async function showAccountVote() {
    if (proposal.status == VoteStatus.votingOngoing) {
      setAccountVote(
        await getAccountVote(proposal.proposal_id, nodeURL(chainId))
      );
    }
  }
  useEffect(() => {
    getProposalData();
  }, []);
  useEffect(() => {
    showAccountVote();
  }, [proposal]);
  useEffect(() => {
    if (id) {
      Mixpanel.events.governanceActions.proposalOpened(id);
    }
  }, [id]);

  const [castingVote, setCastingVote] = useState<VotingOption>(
    VotingOption.NONE
  );
  const [voteStatus, setVoteStatus] = useState<TransactionState>("None");

  async function voteOnProposal(vote: VotingOption) {
    if (!account) return;
    setCastingVote(vote);
    await voteAndSetStatus(
      async () =>
        await txVote(
          account,
          Number(proposal.proposal_id),
          convertToVoteNumber(vote),
          nodeURL(chainId),
          votingFee,
          chain,
          memo
        ),
      setVoteStatus
    );
  }
  return {
    proposalId: id,
    proposalFound,
    proposal,
    voteEnded: proposal.status != VoteStatus.votingOngoing,
    voteData: {
      currentTally: currentVotes,
      percents: calculatePercentVotes(currentVotes, totalGlobalStake),
    },
    userVoteData: {
      currentVote: accountVote,
      votingPower: totalUserStake.toString(),
      votingPowerPercent: totalGlobalStake.isZero()
        ? 0
        : Number(formatUnits(totalUserStake)) /
          Number(formatUnits(totalGlobalStake)),
    },
    customizeData: {
      showPercentVote,
      setShowPercentVote,
    },
    votingFuncionality: {
      voteStatus,
      castingVote,
      txVote: voteOnProposal,
      resetVote: () => {
        setCastingVote(VotingOption.NONE);
        setVoteStatus("None");
      },
    },
  };
}

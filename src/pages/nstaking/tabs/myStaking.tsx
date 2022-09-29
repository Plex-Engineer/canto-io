import styled from "@emotion/styled";
import { CantoMainnet, OutlinedButton } from "cantoui";
import { formatEther } from "ethers/lib/utils";
import { chain, memo } from "global/config/cosmosConstants";
import { truncateNumber } from "global/utils/utils";
import { claimRewardFee } from "pages/staking/config/fees";
import { txClaimRewards } from "pages/staking/utils/transactions";
import InfoBar from "../components/InfoBar";
import NotConnected from "../components/NotConnected";
import { ValidatorTable } from "../components/stakingTable";
import { MyStakingProps, StakingTransactionType } from "../config/interfaces";
import { userTxMessages } from "../config/messages";
import useTransactionStore from "../stores/transactionStore";
import { getActiveTransactionMessage } from "../utils/utils";

const MyStaking = (props: MyStakingProps) => {
  const transactionStore = useTransactionStore();

  async function handleClaimRewards() {
    transactionStore.setTransactionMessage(userTxMessages.waitSign);
    await txClaimRewards(
      props.account,
      CantoMainnet.cosmosAPIEndpoint,
      claimRewardFee,
      chain,
      memo,
      props.userDelegations
    );
    transactionStore.setTransactionMessage(userTxMessages.waitVerify);
    transactionStore.setTransactionMessage(
      await getActiveTransactionMessage(
        props.account,
        "",
        props.totalRewards,
        props.balance,
        StakingTransactionType.CLAIM_REWARDS
      )
    );
  }

  return (
    <Styled>
      {!props.connected ? (
        <NotConnected />
      ) : (
        <div>
          <InfoBar
            balance={truncateNumber(formatEther(props.balance))}
            totalStaked={truncateNumber(formatEther(props.totalStaked))}
            totalUnbonding={truncateNumber(formatEther(props.totalUnbonding))}
            rewards={truncateNumber(formatEther(props.totalRewards))}
            apr={props.apr}
          />
          <OutlinedButton onClick={handleClaimRewards}>
            claim rewards
          </OutlinedButton>
          <ValidatorTable
            validators={props.userValidationInfo}
            sortBy="userTotal"
          />
        </div>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;
`;

export default MyStaking;

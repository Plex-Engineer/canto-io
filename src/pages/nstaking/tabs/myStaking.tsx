import styled from "@emotion/styled";
import { CantoMainnet, OutlinedButton } from "cantoui";
import { formatEther } from "ethers/lib/utils";
import { chain, memo } from "global/config/cosmosConstants";
import { claimRewardFee } from "pages/staking/config/fees";
import { txClaimRewards } from "pages/staking/utils/transactions";
import NotConnected from "../components/NotConnected";
import { TestTable } from "../components/testTable";
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
          <OutlinedButton onClick={handleClaimRewards}>
            claim rewards
          </OutlinedButton>
          <ul>
            <li>{formatEther(props.balance)}</li>
            <li>{formatEther(props.totalStaked)}</li>
            <li>{formatEther(props.totalUnbonding)}</li>
            <li>{formatEther(props.totalRewards)}</li>
            <li>{props.apr}</li>
          </ul>
          <TestTable validators={props.userValidationInfo} sortBy="userTotal" />
        </div>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;
`;

export default MyStaking;

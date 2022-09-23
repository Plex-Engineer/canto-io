import styled from "@emotion/styled";
import { CantoMainnet, OutlinedButton } from "cantoui";
import { formatEther } from "ethers/lib/utils";
import { chain, memo } from "global/config/cosmosConstants";
import { claimRewardFee } from "pages/staking/config/fees";
import { txClaimRewards } from "pages/staking/utils/transactions";
import React, { useState } from "react";
import NotConnected from "../components/NotConnected";
import { ValidatorTable } from "../components/stakingTable";
import { MyStakingProps, StakingTransactionType } from "../config/interfaces";
import { getActiveTransactionMessage } from "../utils/utils";

const MyStaking = (props: MyStakingProps) => {
  const [confirmationMessage, setConfirmationMessage] =
    useState<React.ReactNode>(null);

  async function handleClaimRewards() {
    setConfirmationMessage(
      "waiting for the metamask transaction to be signed..."
    );
    await txClaimRewards(
      props.account,
      CantoMainnet.cosmosAPIEndpoint,
      claimRewardFee,
      chain,
      memo,
      props.userDelegations
    );
    setConfirmationMessage("waiting for the transaction to be verified...");
    setConfirmationMessage(
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
          {confirmationMessage}
          <ul>
            <li>{formatEther(props.balance)}</li>
            <li>{formatEther(props.totalStaked)}</li>
            <li>{formatEther(props.totalUnbonding)}</li>
            <li>{formatEther(props.totalRewards)}</li>
            <li>{props.apr}</li>
          </ul>
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

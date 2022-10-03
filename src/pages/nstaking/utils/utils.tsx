import { CantoMainnet } from "cantoui";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import {
  getCantoBalance,
  getDelegationsForAddress,
} from "pages/staking/utils/transactions";
import { calculateTotalStaked } from "pages/staking/utils/utils";
import React from "react";
import {
  DelegationResponse,
  StakingTransactionType,
} from "../config/interfaces";

export async function getActiveTransactionMessage(
  account: string,
  validatorName: string,
  amount: BigNumber,
  prevBalance: BigNumber,
  transactionType: StakingTransactionType,
  currentValidator?: string,
  newValidatorName?: string
): Promise<React.ReactNode> {
  if (transactionType != StakingTransactionType.NONE) {
    let numberOfBlocksChecked = 0;
    while (numberOfBlocksChecked < 5) {
      await sleep(6000);
      const currentBalance = await getCantoBalance(
        CantoMainnet.cosmosAPIEndpoint,
        account
      );
      const delegations: DelegationResponse[] = await getDelegationsForAddress(
        CantoMainnet.cosmosAPIEndpoint,
        account
      );
      let delegatedTo = BigNumber.from("0");
      if (currentValidator != null) {
        delegations.forEach((delegation) => {
          if (
            delegation.delegation.validator_address.includes(currentValidator)
          ) {
            delegatedTo = BigNumber.from(delegation.balance.amount);
          }
        });
      }
      numberOfBlocksChecked++;

      if (
        (transactionType === StakingTransactionType.DELEGATE ||
          transactionType === StakingTransactionType.CLAIM_REWARDS) &&
        !prevBalance.eq(currentBalance)
      ) {
        return `you have successfully ${
          transactionType == StakingTransactionType.DELEGATE
            ? "delegated"
            : "claimed"
        } ${truncateNumber(formatEther(amount))} CANTO ${
          validatorName ? `to ${validatorName}` : "in rewards"
        }`;
      } else if (
        transactionType === StakingTransactionType.UNDELEGATE &&
        !delegatedTo.eq(prevBalance)
      ) {
        return `you have successfully undelegated ${truncateNumber(
          formatEther(amount)
        )} CANTO from ${validatorName}`;
      } else if (
        transactionType === StakingTransactionType.REDELEGATE &&
        !delegatedTo.eq(amount)
      ) {
        return `you have successfully redelegated ${truncateNumber(
          formatEther(amount)
        )} CANTO from ${validatorName} to ${newValidatorName}`;
      }
    }
    //since we have checked multiple blocks, the transaction must have failed
    const transactionName = getTransactionName(transactionType);
    return (
      <>
        {`your ${transactionName} was unsuccessful. this may be an issue related to
              gas. read more about why in the docs (toggle the menu in the
              corner) or in the canto discord here `}
        <a style={{ color: "white" }} href="https://discord.gg/yVvkr9RE">
          here
        </a>
      </>
    );
  }
  return "";
}
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getTransactionName(transactionType: StakingTransactionType) {
  switch (transactionType) {
    case StakingTransactionType.DELEGATE:
      return "delegation";
    case StakingTransactionType.UNDELEGATE:
      return "undelegation";
    case StakingTransactionType.REDELEGATE:
      return "redelegation";
    case StakingTransactionType.CLAIM_REWARDS:
      return "claim rewards";
    default:
      return "";
  }
}

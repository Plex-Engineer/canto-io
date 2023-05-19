import { CantoMainnet } from "global/config/networks";
import { BigNumber } from "ethers";
import {
  DelegationResponse,
  MasterValidatorProps,
  UndelegationMap,
  Validator,
} from "../config/interfaces";

export function getAllValidatorData(
  validators: Validator[],
  delegations: DelegationResponse[],
  undelegations: UndelegationMap
): MasterValidatorProps[] {
  function find_matched_address(
    op_address: string,
    undelegations: UndelegationMap
  ) {
    const operator_address = op_address;
    return undelegations.validators?.find((o) => o.name === operator_address);
  }

  return validators.map((validator) => {
    const userDelegation = delegations.find((delegation) => {
      return (
        delegation.delegation.validator_address === validator.operator_address
      );
    });
    return {
      validator: validator,
      userDelegations: userDelegation,
      undelagatingInfo: find_matched_address(
        validator["operator_address"],
        undelegations
      ),
    };
  });
}

export const calculateTotalStaked = (delegations: DelegationResponse[]) => {
  let total = BigNumber.from("0");
  delegations.forEach((delegation) => {
    if (delegation.balance.denom.includes("acanto")) {
      total = total.add(delegation.balance.amount);
    }
  });
  return total;
};

export async function getStakingApr() {
  const urlInflation =
    CantoMainnet.cosmosAPIEndpoint + "/canto/inflation/v1/epoch_mint_provision";
  const urlStake =
    CantoMainnet.cosmosAPIEndpoint + "/cosmos/staking/v1beta1/pool";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const totalStake = await fetch(urlStake, options)
    .then((response) => response.json())
    .then((result) => {
      return parseFloat(result.pool.bonded_tokens);
    })
    .catch(() => {
      return 0;
    });

  const mintProvision = await fetch(urlInflation, options)
    .then((response) => response.json())
    .then((result) => {
      return parseFloat(result.epoch_mint_provision.amount);
    })
    .catch(() => {
      return 0;
    });

  let apr = mintProvision / totalStake;
  apr *= 365 * 100;
  return apr.toFixed(3);
}

import { CantoMainnet } from "cantoui";
import { BigNumber, ethers } from "ethers";

/* eslint-disable camelcase */
export interface Validator {
  commission: {
    commission_rates: {
      max_change_rate: string;
      max_rate: string;
      rate: string;
    };
    update_time: string;
  };
  consensus_pubkey: {
    "@type": string;
    key: string;
  };
  delegator_shares: string;
  description: {
    details: string;
    identity: string;
    moniker: string;
    security_contact: string;
    website: string;
  };
  jailed: boolean;
  min_self_delegation: string;
  operator_address: string;
  status: string;
  tokens: string;
  unbonding_height: string;
  unbonding_time: string;
}

export interface DelegationResponse {
  balance: Coin;
  delegation: {
    delegator_address: string;
    shares: string;
    validator_address: string;
  };
}

/* eslint-disable camelcase */
export interface UndelegationResponse {
  delegator_address: string;
  validator_address: string;
  entries: [
    {
      creation_height: string;
      completion_time: string;
      initial_balance: string;
      balance: string;
    }
  ];
}

/* eslint-disable camelcase */
export interface GetUndelegationsResponse {
  unbonding_responses: UndelegationResponse[];
  pagination: {
    next_key: string;
    total: string;
  };
}

/* eslint-disable camelcase */
export interface GetDelegationsResponse {
  delegation_responses: DelegationResponse[];
  pagination: {
    next_key: string;
    total: number;
  };
}

export interface lockout {
  complete_time_stamp: string;
  value_of_coin: BigNumber;
}

export interface validators {
  name: string;
  validator_unbonding: BigNumber;
  lockouts?: lockout[];
}

/* eslint-disable camelcase */
export interface UndelegationMap {
  // total_unbonding : BigNumber,
  // validators : [{
  //     name : string,
  //     validator_unbonding: BigNumber,
  //     lockouts: [{
  //         complete_time_stamp: string,
  //         value_of_coin: BigNumber
  //     }]
  // }]
  total_unbonding: BigNumber;
  validators?: validators[];
}

export interface Coin {
  denom: string;
  amount: string;
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

export interface Reward {
  validator_address: string;
  reward: Coin[];
}

export interface DistributionRewardsResponse {
  rewards: Reward[];
  total: Coin[];
}

export interface BalancesResponse {
  balances: Coin[];
  pagination: {
    next_key: string;
    total: number;
  };
}

export const multiple = BigNumber.from("1000000000000000000");

export function formatNumber(bigNumber: BigNumber, decimals: number) {
  const unitFormatted = ethers.utils.formatUnits(bigNumber, decimals);
  const split = unitFormatted.split(".");
  if (split.length > 1) {
    const decimals = split[1].length;
    return (
      split[0] +
      "." +
      split[1].slice(0, Math.min(3, decimals)) +
      "0".repeat(Math.max(3 - decimals, 0))
    );
  }
  return split[0];
}

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
    .catch((err) => {
      return 0;
    });

  const mintProvision = await fetch(urlInflation, options)
    .then((response) => response.json())
    .then((result) => {
      return parseFloat(result.epoch_mint_provision.amount);
    })
    .catch((err) => {
      return 0;
    });

  let apr = mintProvision / totalStake;
  apr *= 365 * 100;
  return apr.toFixed(3);
}

// 6 second
export const REFRESH_RATE = 10000;

export const TRANSACTION_WAIT_PERIOD = 10000;

import { BigNumber } from "ethers";

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
interface Coin {
  denom: string;
  amount: string;
}
export interface DelegationResponse {
  balance: Coin;
  delegation: {
    delegator_address: string;
    shares: string;
    validator_address: string;
  };
}

interface lockout {
  complete_time_stamp: string;
  value_of_coin: BigNumber;
}
export interface UndelegatingValidator {
  name: string;
  validator_unbonding: BigNumber;
  lockouts?: lockout[];
}

export interface UndelegationMap {
  total_unbonding: BigNumber;
  validators?: UndelegatingValidator[];
}

export interface MyStakingProps {
  connected: boolean;
  balance: BigNumber;
  totalStaked: BigNumber;
  totalUnbonding: BigNumber;
  totalRewards: BigNumber;
  apr: string;
  userDelegations: Validator[];
}
export interface AllStakingProps {
  validators: Validator[];
}
export enum StakingTransactionType {
  NONE,
  DELEGATE,
  UNDELEGATE,
  REDELEGATE,
  CLAIM_REWARDS,
}

export interface ValidatorTableProps {
  validators: Validator[];
  userDelegations: DelegationResponse[];
  userUndelegations: UndelegationMap;
}

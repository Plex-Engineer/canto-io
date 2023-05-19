import {
  CantoTransactionType,
  TransactionDetails,
} from "global/config/interfaces/transactionTypes";
import { TransactionStore } from "global/stores/transactionStore";
import {
  txClaimRewards,
  txRedelegate,
  txStake,
  txUnstake,
} from "./transactionHelpers";
import { Chain, Fee } from "global/config/cosmosConstants";
import {
  MasterValidatorProps,
  StakingTransactionType,
} from "../config/interfaces";
import { createTransactionDetails } from "global/stores/transactionUtils";
import {
  getCosmosAPIEndpoint,
  getCosmosChainObj,
} from "global/utils/getAddressUtils";
import { claimRewardFee, delegateFee, unbondingFee } from "../config/fees";

interface GeneralStakingParams {
  account: string;
  chainId?: number;
  amount: string;
  newOperator?: {
    address: string;
    name: string;
  };
  operator: {
    address: string;
    name: string;
  };
}
export async function stakingTx(
  txStore: TransactionStore,
  txType: StakingTransactionType,
  params: GeneralStakingParams
): Promise<boolean> {
  if (!params.account) {
    return false;
  }
  const isRedelegate = txType === StakingTransactionType.REDELEGATE;
  const delegateDetails = isRedelegate
    ? createTransactionDetails(txStore, CantoTransactionType.REDELEGATE, {
        symbol: `from ${params.operator?.name} to ${params.newOperator?.name}`,
      })
    : createTransactionDetails(
        txStore,
        txType === StakingTransactionType.DELEGATE
          ? CantoTransactionType.DELEGATE
          : CantoTransactionType.UNDELEGATE,
        { symbol: params.operator.name }
      );
  txStore.addTransactions([delegateDetails]);
  return isRedelegate
    ? await _performRedelegate(
        txStore,
        params.account,
        params.operator.address,
        params.newOperator?.address ?? "",
        params.amount,
        getCosmosAPIEndpoint(params.chainId),
        unbondingFee,
        getCosmosChainObj(params.chainId),
        "",
        delegateDetails,
        params.chainId
      )
    : await _performDelegate(
        txStore,
        txType === StakingTransactionType.DELEGATE,
        params.account,
        params.operator.address,
        params.amount,
        getCosmosAPIEndpoint(params.chainId),
        delegateFee,
        getCosmosChainObj(params.chainId),
        "",
        delegateDetails,
        params.chainId
      );
}
export async function claimStakingRewards(
  txStore: TransactionStore,
  chainId: number | undefined,
  account: string,
  userValidators: MasterValidatorProps[]
): Promise<boolean> {
  if (!account) {
    return false;
  }
  const claimDetails = createTransactionDetails(
    txStore,
    CantoTransactionType.CLAIM_REWARDS_STAKING
  );
  txStore.addTransactions([claimDetails]);
  return await txStore.performCosmosTx({
    chainId,
    details: claimDetails,
    tx: txClaimRewards,
    params: [
      account,
      getCosmosAPIEndpoint(chainId),
      claimRewardFee,
      getCosmosChainObj(chainId),
      "",
      userValidators,
    ],
  });
}

//is staking will tell us if this is a delegate or undelegate
async function _performDelegate(
  txStore: TransactionStore,
  isStaking: boolean,
  account: string,
  operatorAddress: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  delegateDetails?: TransactionDetails,
  chainId?: number
): Promise<boolean> {
  if (!operatorAddress) {
    return false;
  }
  return await txStore.performCosmosTx({
    chainId,
    details: delegateDetails,
    tx: isStaking ? txStake : txUnstake,
    params: [account, operatorAddress, amount, endpoint, fee, chain, memo],
  });
}
async function _performRedelegate(
  txStore: TransactionStore,
  account: string,
  fromOperatorAddress: string,
  toOperatorAddress: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  redelegateDetails?: TransactionDetails,
  chainId?: number
): Promise<boolean> {
  if (!fromOperatorAddress || !toOperatorAddress) {
    return false;
  }
  return await txStore.performCosmosTx({
    chainId,
    details: redelegateDetails,
    tx: txRedelegate,
    params: [
      account,
      amount,
      endpoint,
      fee,
      chain,
      memo,
      fromOperatorAddress,
      toOperatorAddress,
    ],
  });
}

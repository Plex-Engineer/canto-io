import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from "react";
import {
  DelegationResponse,
  MasterValidatorProps,
  StakingTransactionType,
  UndelegationMap,
  Validator,
} from "../config/interfaces";
import {
  getDelegationsForAddress,
  getDistributionRewards,
  getUndelegationsForAddress,
  getValidators,
  txClaimRewards,
} from "pages/staking/utils/transactions";
import { CantoMainnet } from "global/config/networks";
import { useNetworkInfo } from "global/stores/networkInfo";
import { BigNumber } from "ethers";
import {
  calculateTotalStaked,
  getAllValidatorData,
  getStakingApr,
} from "../utils/allUserValidatorInfo";
import useTransactionStore from "../stores/transactionStore";
import { chain, memo } from "global/config/cosmosConstants";
import { claimRewardFee } from "../config/fees";
import useValidatorModalStore, {
  ValidatorModalType,
} from "../stores/validatorModalStore";
import { performTxAndSetStatus } from "../utils/utils";

const useStaking = (): [
  Validator[],
  DelegationResponse[],
  UndelegationMap,
  MasterValidatorProps[],
  MasterValidatorProps[],
  () => Promise<void>,
  BigNumber,
  string
] => {
  const networkInfo = useNetworkInfo();
  const transactionStore = useTransactionStore();
  const validatorModalStore = useValidatorModalStore();
  // get all of the validators
  const [validators, setValidators] = useState<Validator[]>([]);
  const [stakingApr, setStakingApr] = useState("");
  // get all of the validators the user has staked to
  const [delegations, setDelegations] = useState<DelegationResponse[]>([]);
  // get all of the undelegations for the user
  const [undelegations, setUndelegations] = useState<UndelegationMap>({
    total_unbonding: BigNumber.from("0"),
  });
  // get all of the rewards for the user
  const [rewards, setRewards] = useState<BigNumber>(BigNumber.from("0"));

  async function handleClaimRewards() {
    validatorModalStore.open(ValidatorModalType.STAKE);
    performTxAndSetStatus(
      async () =>
        await txClaimRewards(
          networkInfo.account ?? "",
          CantoMainnet.cosmosAPIEndpoint,
          claimRewardFee,
          chain,
          memo,
          userValidators
        ),
      StakingTransactionType.CLAIM_REWARDS,
      transactionStore.setTransactionStatus,
      validatorModalStore.close,
      "",
      rewards
    );
  }

  async function getAllData() {
    if (networkInfo.account) {
      setDelegations(
        await getDelegationsForAddress(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.account
        )
      );
      setRewards(
        await getDistributionRewards(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.account
        )
      );
      setUndelegations(
        await getUndelegationsForAddress(
          CantoMainnet.cosmosAPIEndpoint,
          networkInfo.account
        )
      );
    }
    setValidators(await getValidators(CantoMainnet.cosmosAPIEndpoint));
    setStakingApr(await getStakingApr());
  }

  //get new data every 6 seconds for the block time
  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllData();
    }, 6000);
    return () => clearInterval(interval);
  }, [networkInfo.account]);
  useEffect(() => {
    getAllData();
  }, [networkInfo.account]);

  const allValidatorData = getAllValidatorData(
    validators,
    delegations,
    undelegations
  );

  const undelagatingValidators = allValidatorData.filter(
    (validator) => !!validator.undelagatingInfo
  );
  const userValidators = allValidatorData.filter(
    (validator) => !!validator.userDelegations
  );

  return [
    validators,
    delegations,
    undelegations,
    userValidators,
    undelagatingValidators,
    handleClaimRewards,
    rewards,
    stakingApr,
  ];
};

export default useStaking;

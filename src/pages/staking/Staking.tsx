import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyStaking from "./tabs/myStaking";
import AllDerevatives from "./tabs/allDerevatives";
import Styled from "./style";
import { useEffect, useState } from "react";
import {
  DelegationResponse,
  StakingTransactionType,
  UndelegationMap,
  Validator,
} from "./config/interfaces";
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
} from "./utils/allUserValidatorInfo";
import { ModalManager } from "./modals/modalManager";
import useTransactionStore from "./stores/transactionStore";
import { chain, memo } from "global/config/cosmosConstants";
import { claimRewardFee } from "./config/fees";
import HelmetSEO from "global/components/seo";
import useValidatorModalStore, {
  ValidatorModalType,
} from "./stores/validatorModalStore";
import { performTxAndSetStatus } from "./utils/utils";

const Staking = () => {
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

  const [isHovering, setIsHovering] = useState(false);
  return (
    <>
      <HelmetSEO
        title="Canto - Staking"
        description="A test message written for staking using validators"
        link="staking"
      />
      <Styled>
        <ModalManager allValidators={validators} />
        <Tabs className="tabs">
          <TabList className="tablist">
            <Tab
              className={isHovering ? "tab tab-hover" : "tab"}
              onMouseEnter={() => {
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
              }}
            >
              my staking
            </Tab>
            <Tab
              className={isHovering ? "tab tab-hover" : "tab"}
              onMouseEnter={() => {
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
              }}
            >
              all validators
            </Tab>
          </TabList>
          <TabPanel>
            <MyStaking
              onRewards={handleClaimRewards}
              connected={Number(networkInfo.chainId) == CantoMainnet.chainId}
              account={networkInfo.account ?? ""}
              balance={networkInfo.balance}
              totalStaked={calculateTotalStaked(delegations)}
              totalUnbonding={undelegations.total_unbonding}
              totalRewards={rewards}
              apr={stakingApr}
              userValidationInfo={userValidators}
              undelegationValidators={undelagatingValidators}
            />
          </TabPanel>
          <TabPanel>
            <AllDerevatives
              validators={getAllValidatorData(
                validators,
                delegations,
                undelegations
              )}
            />
          </TabPanel>
        </Tabs>
      </Styled>
    </>
  );
};

export default Staking;

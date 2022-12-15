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
import { Selected } from "./modals/redelgationModal";
import Select from "react-select";

import { CSearch } from "global/packages/src/components/atoms/Input";
import useStakingStore from "./stores/stakingStore";

const Staking = () => {
  const networkInfo = useNetworkInfo();
  const transactionStore = useTransactionStore();
  const validatorModalStore = useValidatorModalStore();
  const stakingStore = useStakingStore();
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

  const ToggleDisplayOptions = [
    {
      label: "active",
      value: 1,
    },
    {
      label: "inactive",
      value: 2,
    },
    {
      label: "all",
      value: 3,
    },
  ];
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
              onClick={() => {
                stakingStore.setInAllValidators(false);
              }}
            >
              my staking
            </Tab>
            <Tab
              className={isHovering ? "tab tab-hover" : "tab"}
              onClick={() => {
                stakingStore.setInAllValidators(true);
              }}
              onMouseEnter={() => {
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
              }}
            >
              all validators
            </Tab>

            <div
              className="sort-search"
              style={{
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "2rem",
                display: stakingStore.inAllValidators ? "flex" : "none",
              }}
            >
              <Selected
                style={{
                  width: "10rem",
                }}
              >
                <Select
                  className="react-select-container"
                  styles={{
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      color: "var(--primary-color)",
                    }),
                  }}
                  classNamePrefix="react-select"
                  options={ToggleDisplayOptions}
                  onChange={(val) => {
                    stakingStore.setValidatorSort(val?.value ?? 1);
                  }}
                  defaultValue={{
                    label: "active",
                    value: 1,
                  }}
                  isSearchable={false}
                  placeholder="active"
                />
              </Selected>
              <CSearch
                //   type={"search"}
                style={{
                  textAlign: "left",
                  paddingRight: "1rem",
                }}
                value={stakingStore.searchQuery}
                onChange={(e) => stakingStore.setSearchQuery(e.target.value)}
                placeholder="search..."
              />
            </div>
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

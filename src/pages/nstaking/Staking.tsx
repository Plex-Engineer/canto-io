import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyStaking from "./tabs/myStaking";
import AllDerevatives from "./tabs/allDerevatives";
import Transactions from "./tabs/transactions";
import Styled from "./style";
import { useEffect, useState } from "react";
import {
  DelegationResponse,
  UndelegationMap,
  Validator,
} from "./config/interfaces";
import {
  getDelegationsForAddress,
  getDistributionRewards,
  getUndelegationsForAddress,
  getValidators,
} from "pages/staking/utils/transactions";
import { CantoMainnet } from "cantoui";
import { calculateTotalStaked, getStakingApr } from "pages/staking/utils/utils";
import { useNetworkInfo } from "global/stores/networkInfo";
import { BigNumber } from "ethers";
import { getAllValidatorData } from "./utils/allUserValidatorInfo";
import { ModalManager } from "./modals/modalManager";
import useTransactionStore from "./stores/transactionStore";

const NStaking = () => {
  const networkInfo = useNetworkInfo();
  const transactionStore = useTransactionStore();
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

  const userValidators = validators.filter((validator) => {
    for (let i = 0; i < delegations.length; i++) {
      const delegation = delegations[i];
      if (
        delegation.delegation.validator_address == validator.operator_address
      ) {
        return true;
      }
    }
    return false;
  });

  const undelagatingValidators = getAllValidatorData(
    validators,
    delegations,
    undelegations
  ).filter((validator) => !!validator.undelagatingInfo);
  return (
    <Styled>
      <ModalManager allValidators={validators} />
      <Tabs className={"tabs"}>
        <TabList>
          <Tab>my staking</Tab>
          <Tab>all validators</Tab>
          <Tab>transactions</Tab>
        </TabList>
        {transactionStore.transactionMessage}
        <TabPanel>
          <MyStaking
            connected={Number(networkInfo.chainId) == CantoMainnet.chainId}
            account={networkInfo.account ?? ""}
            balance={networkInfo.balance}
            totalStaked={calculateTotalStaked(delegations)}
            totalUnbonding={undelegations.total_unbonding}
            totalRewards={rewards}
            apr={stakingApr}
            userValidationInfo={getAllValidatorData(
              userValidators,
              delegations,
              undelegations
            )}
            userDelegations={userValidators}
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
        <TabPanel>
          <Transactions />
        </TabPanel>
      </Tabs>
    </Styled>
  );
};

export default NStaking;

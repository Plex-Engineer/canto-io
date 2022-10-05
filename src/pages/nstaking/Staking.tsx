import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyStaking from "./tabs/myStaking";
import AllDerevatives from "./tabs/allDerevatives";
import Transactions from "./tabs/transactions";
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
import { CantoMainnet } from "cantoui";
import { calculateTotalStaked, getStakingApr } from "pages/staking/utils/utils";
import { useNetworkInfo } from "global/stores/networkInfo";
import { BigNumber } from "ethers";
import { getAllValidatorData } from "./utils/allUserValidatorInfo";
import { ModalManager } from "./modals/modalManager";
import useTransactionStore from "./stores/transactionStore";
import { OutlinedButton } from "global/packages/src/components/atoms/Button";
import { userTxMessages } from "./config/messages";
import { getActiveTransactionMessage } from "./utils/utils";
import { chain, memo } from "global/config/cosmosConstants";
import { claimRewardFee } from "./config/fees";

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

  async function handleClaimRewards() {
    transactionStore.setTransactionMessage(userTxMessages.waitSign);
    await txClaimRewards(
      networkInfo.account ?? "",
      CantoMainnet.cosmosAPIEndpoint,
      claimRewardFee,
      chain,
      memo,
      userValidators
    );
    transactionStore.setTransactionMessage(userTxMessages.waitVerify);
    transactionStore.setTransactionMessage(
      await getActiveTransactionMessage(
        networkInfo.account ?? "",
        "",
        rewards,
        networkInfo.balance,
        StakingTransactionType.CLAIM_REWARDS
      )
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

  //   useEffect(() => {
  //     toast
  //   }, [transactionStore.transactionMessage]);
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
  return (
    <Styled>
      <ModalManager allValidators={validators} />
      <Tabs className={"tabs"}>
        <TabList>
          <Tab>my staking</Tab>
          <Tab>all validators</Tab>
          <div
            style={{
              flex: "5",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <OutlinedButton
              onClick={() => {
                handleClaimRewards();
              }}
            >
              claim rewards
            </OutlinedButton>
          </div>
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
  );
};

export default NStaking;

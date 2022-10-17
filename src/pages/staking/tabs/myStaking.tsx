import styled from "@emotion/styled";
import { formatEther } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import { truncateNumber } from "global/utils/utils";
import InfoBar from "../components/InfoBar";
import NotConnected from "../components/NotConnected";
import { ValidatorTable } from "../components/stakingTable";
import { UndelegatingTable } from "../components/undelegatingTable";
import { MyStakingProps } from "../config/interfaces";

const MyStaking = (props: MyStakingProps) => {
  return (
    <Styled>
      {!props.connected ? (
        <NotConnected />
      ) : (
        <div>
          <InfoBar
            balance={truncateNumber(formatEther(props.balance))}
            totalStaked={truncateNumber(formatEther(props.totalStaked))}
            totalUnbonding={truncateNumber(formatEther(props.totalUnbonding))}
            rewards={truncateNumber(formatEther(props.totalRewards))}
            apr={props.apr}
          />
          <Text type="text" color="primary" align="left">
            current staking position
          </Text>
          <ValidatorTable
            validators={props.userValidationInfo}
            sortBy="userTotal"
          />

          <Text
            type="text"
            color="primary"
            align="left"
            hidden={props.undelegationValidators.length == 0}
          >
            currently undelegating
          </Text>
          <UndelegatingTable validators={props.undelegationValidators} />
          <br />
        </div>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;
  width: 70%;
  margin: 0 auto;
  justify-content: center;
`;

export default MyStaking;

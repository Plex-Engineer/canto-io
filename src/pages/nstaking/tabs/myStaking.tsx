import styled from "@emotion/styled";
import { formatEther } from "ethers/lib/utils";
import NotConnected from "../components/NotConnected";
import { TestTable } from "../components/testTable";
import { MyStakingProps } from "../config/interfaces";

const MyStaking = (props: MyStakingProps) => {
  return (
    <Styled>
      {!props.connected ? (
        <NotConnected />
      ) : (
        <div>
          <ul>
            <li>{formatEther(props.balance)}</li>
            <li>{formatEther(props.totalStaked)}</li>
            <li>{formatEther(props.totalUnbonding)}</li>
            <li>{formatEther(props.totalRewards)}</li>
            <li>{props.apr}</li>
          </ul>
          <TestTable validators={props.userDelegations} sortBy="userTotal" />
        </div>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;
`;

export default MyStaking;

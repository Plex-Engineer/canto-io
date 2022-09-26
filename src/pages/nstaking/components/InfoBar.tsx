import styled from "@emotion/styled";
import React from "react";

interface Props {
  balance: string;
  totalStaked: string;
  totalUnbonding: string;
  rewards: string;
  apr: string;
}
const InfoBar = ({
  balance,
  totalStaked,
  totalUnbonding,
  rewards,
  apr,
}: Props) => {
  return (
    <Styled>
      <div className="dual-item">
        <div className="top">balance</div>
        <div className="bottom">{balance}</div>
      </div>
      <div className="dual-item">
        <div className="top">total staked</div>
        <div className="bottom">{totalStaked}</div>
      </div>
      <div className="dual-item">
        <div className="top">total unbonding</div>
        <div className="bottom">{totalUnbonding}</div>
      </div>
      <div className="dual-item">
        <div className="top">rewards</div>
        <div className="bottom">{rewards}</div>
      </div>
      <div className="dual-item">
        <div className="top">apr</div>
        <div className="bottom">{apr}</div>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  justify-content: space-around;
  color: var(--primary-color);
  padding: 2rem;
  .dual-item {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  .top {
    font-size: 14px;
  }
  .bottom {
    font-family: "Silkscreen", cursive;
    font-size: 30px;
    text-shadow: none;
  }
`;
export default InfoBar;

import styled from "@emotion/styled";
import { OutlinedButton } from "global/packages/src";

interface Props {
  balance: string;
  totalStaked: string;
  totalUnbonding: string;
  rewards: string;
  apr: string;
  onRewards: () => Promise<void>;
}
const InfoBar = ({ totalStaked, rewards, apr, onRewards }: Props) => {
  return (
    <Styled>
      <div className="dual-item">
        <div className="top">total staked</div>
        <div className="bottom">{totalStaked}</div>
      </div>

      <div className="dual-item">
        <div className="top">apr</div>
        <div className="bottom">{apr + "%"}</div>
      </div>
      <div className="dual-item">
        <div className="top">rewards</div>
        <div className="bottom">{rewards}</div>
      </div>
      <OutlinedButton
        height="big"
        disabled={Number(rewards) == 0}
        onClick={() => {
          onRewards();
        }}
      >
        claim rewards
      </OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--primary-color);
  padding: 2rem 0;
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
  }
  @media (max-width: 1000px) {
    width: 100%;
    gap: 1rem;
    flex-direction: column;
  }
`;
export default InfoBar;

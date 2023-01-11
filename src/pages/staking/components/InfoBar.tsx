import styled from "@emotion/styled";
import { OutlinedButton, Text } from "global/packages/src";

interface Props {
  balance: string;
  totalStaked: string;
  totalUnbonding: string;
  rewards: string;
  apr: string;
  onRewards: () => Promise<void>;
  canClaim: boolean;
}
const InfoBar = ({ totalStaked, rewards, apr, onRewards, canClaim }: Props) => {
  return (
    <Styled>
      <div className="dual-item">
        <div className="top">total staked</div>
        <div className="bottom">
          <Text type="title">{totalStaked}</Text>
        </div>
      </div>

      <div className="dual-item">
        <div className="top">% apr</div>
        <div className="bottom">
          <Text type="title">{apr}</Text>
        </div>
      </div>
      <div className="dual-item">
        <div className="top">rewards</div>
        <div className="bottom">
          <Text type="title">{rewards}</Text>
        </div>
      </div>
      <OutlinedButton
        height="big"
        disabled={Number(rewards) == 0 || !canClaim}
        onClick={() => {
          onRewards();
        }}
      >
        <Text size="text2" type="text" bold>
          claim rewards
        </Text>
      </OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--primary-color);
  padding: 40px 0;
  .dual-item {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
  }
  .top {
    font-size: 14px;
  }
  .bottom {
    /* font-family: "Silkscreen", cursive; */
    p {
      font-size: 40px !important;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
    gap: 1rem;
    flex-direction: column;
  }
`;
export default InfoBar;

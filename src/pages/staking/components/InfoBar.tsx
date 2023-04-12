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
      <div
        className="dual-item"
        style={{
          margin: "0",
        }}
      >
        <div className="top">
          <Text type="title" size="text1">
            total staked
          </Text>
        </div>
        <div className="bottom">
          <Text type="title">{totalStaked}</Text>
        </div>
      </div>
      <div className="separator"></div>
      <div className="dual-item">
        <div className="top">
          <Text type="title" size="text1">
            apr
          </Text>
        </div>
        <div className="bottom">
          <Text type="title">{apr}%</Text>
        </div>
      </div>
      <div className="separator"></div>

      <div className="dual-item">
        <div className="top">
          <Text type="title" size="text1">
            rewards
          </Text>
        </div>
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

  .separator {
    height: 80px;
    border-left: 1px solid var(--primary-color);
  }
  .dual-item {
    display: flex;
    flex-grow: 1;
    flex-direction: column-reverse;
    justify-content: center;
    margin: 0 20px;
    align-items: flex-start;
    gap: 4px;
    position: relative;
  }
  .top {
    font-size: 14px;
  }
  .bottom {
    p {
      font-size: 40px !important;
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
    gap: 1rem;
    flex-direction: column;

    .separator {
      height: 1px;
      width: 80%;
      border-bottom: 1px solid var(--primary-color);
      opacity: 0.4;
    }
  }
`;
export default InfoBar;

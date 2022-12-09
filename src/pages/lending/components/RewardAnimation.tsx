import rewardS from "assets/rewards/reward-sm.svg";
import rewardM from "assets/rewards/reward-md.svg";
import rewardL from "assets/rewards/reward-lg.svg";
import rewardXL from "assets/rewards/reward-xlg.svg";
import styled from "@emotion/styled";

interface Props {
  reverse?: boolean;
}
const RewardAnimation = (props: Props) => {
  return (
    <Styled {...props}>
      <img src={rewardS} />
      <img src={rewardM} />
      <img src={rewardL} />
      <img src={rewardXL} />
    </Styled>
  );
};

const Styled = styled.div<Props>`
  display: flex;
  transform: ${({ reverse }) => (reverse ? "rotateZ(180deg)" : "")};
  gap: 0.4rem;
  padding: 6px 32px;
  @media (max-width: 1000px) {
    padding: 6px 10px;
  }
  img {
    opacity: 0.02;
    animation: glow 1.7s infinite ease-out;
    &:nth-of-type(1) {
    }
    &:nth-of-type(2) {
      animation-delay: 0.25s;
    }
    &:nth-of-type(3) {
      animation-delay: 0.75s;
    }
    &:nth-of-type(4) {
      animation-delay: 1s;
    }
  }

  @keyframes glow {
    0% {
      opacity: 0.8;
    }
    40% {
      opacity: 0.2;
    }
    60% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.8;
    }
  }
`;
export default RewardAnimation;

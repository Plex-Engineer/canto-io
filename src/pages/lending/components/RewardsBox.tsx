import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import RewardAnimation from "./RewardAnimation";

type Props = {
  rewards: string;
};
const RewardsBox = ({ rewards }: Props) => {
  return (
    <Styled>
      <RewardAnimation reverse />
      <div>
        <Text type="title" size="text1">
          Rewards
        </Text>

        <Text type="title" size="title1">
          {rewards}
        </Text>
      </div>
      <RewardAnimation />
    </Styled>
  );
};

export default RewardsBox;

const Styled = styled.div`
  display: flex;
`;

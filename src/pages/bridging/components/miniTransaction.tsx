import styled from "@emotion/styled";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";

interface Props {
  origin: "Ethereum" | "Cosmos";
  timeLeftInSecs: number;
  amount: BigNumber;
  token: string;
}
const MiniTransaction = (props: Props) => {
  return (
    <Styled>
      <div className="dual-item">
        <Text size="text3" align="left">
          origin
        </Text>
        <Text type="title">{props.origin}</Text>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          time left
        </Text>
        <Text type="title" size="text2">
          {props.timeLeftInSecs} mins left
        </Text>
      </div>
      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title">{formatEther(props.amount)}</Text>
      </div>
      <PrimaryButton height="normal" weight="bold">
        complete
      </PrimaryButton>
    </Styled>
  );
};

const Styled = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  background: #010101;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
`;

export default MiniTransaction;

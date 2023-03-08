import styled from "@emotion/styled";
import { formatCurrency } from "@usedapp/core/dist/esm/src/model";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { formatBalance } from "global/utils/utils";

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
          {props.timeLeftInSecs === 0
            ? "done "
            : props.timeLeftInSecs + " mins left"}
        </Text>
      </div>
      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title">
          {formatBalance(formatEther(props.amount))}
          {" " + props.token}
        </Text>
      </div>
      <PrimaryButton
        style={{
          maxWidth: "7rem",
        }}
        height="normal"
        disabled={props.timeLeftInSecs !== 0}
        weight="bold"
        filled
      >
        {props.timeLeftInSecs !== 0 ? "ongoing" : "complete"}
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

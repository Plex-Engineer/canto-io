import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { formatBalance } from "global/utils/utils";
import { ConvertTransaction } from "../config/interfaces";
import { convertSecondsToString } from "../utils/utils";

interface Props {
  transaction: ConvertTransaction;
}
const MiniTransaction = (props: Props) => {
  return (
    <Styled>
      <div className="dual-item">
        <Text size="text3" align="left">
          origin
        </Text>
        <Text type="title">{props.transaction.origin}</Text>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          time left
        </Text>
        <Text type="title" size="text2">
          {convertSecondsToString(props.transaction.timeLeft)}
        </Text>
      </div>
      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title">
          {formatBalance(
            formatUnits(
              props.transaction.amount,
              props.transaction.token.decimals
            )
          )}
          {" " + props.transaction.token.symbol}
        </Text>
      </div>
      <PrimaryButton
        style={{
          maxWidth: "7rem",
        }}
        height="normal"
        disabled={props.transaction.timeLeft !== "0"}
        weight="bold"
        filled
      >
        {props.transaction.timeLeft !== "0" ? "ongoing" : "complete"}
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

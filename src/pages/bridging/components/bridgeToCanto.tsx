import styled from "@emotion/styled";
import { BigNumber } from "ethers";
import { Text } from "global/packages/src";
import { ConvertTransaction } from "../config/interfaces";
import MiniTransaction from "./miniTransaction";

interface BridgeToCantoProps {
  transactions: ConvertTransaction[];
}
const BridgeToCanto = (props: BridgeToCantoProps) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        Transactions
      </Text>
      <Text type="text" size="text3">
        once the transaction is done, please click on complete to get the funds
        from bridge to canto (evm)
      </Text>
      <div className="scroll-port">
        <div className="scrollable">
          {props.transactions.map((tx, index) => {
            return <MiniTransaction key={index} transaction={tx} />;
          })}
        </div>
      </div>
    </Styled>
  );
};
const Styled = styled.div`
  background: #090909;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  width: 600px;
  padding: 1rem 2rem;
  margin-top: 3rem;

  .scroll-port {
    margin-top: 1rem;
    max-height: 300px;
    overflow-y: auto;
  }
  .scrollable {
    width: 100%;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
export default BridgeToCanto;

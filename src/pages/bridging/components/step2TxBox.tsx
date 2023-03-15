import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { NativeTransaction } from "../config/interfaces";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import MiniTransaction from "./miniTransaction";

interface Step2TxBoxProps {
  transactions: NativeTransaction[];
  txHook: (tokenName: string) => BridgeTransaction;
  cantoAddress: string;
  ethAddress: string;
  bridgeIn: boolean;
}
const Step2TxBox = (props: Step2TxBoxProps) => {
  return (
    <Styled>
      <Text type="title" size="title2">
        Transactions
      </Text>
      <Text type="text" size="text3">
        {props.bridgeIn
          ? `once the transaction is done, please click on complete to get the funds
        from bridge to canto (evm)`
          : "once the transactions is done, please click on complete to get the funds to the desired cosmos network"}
      </Text>
      <div className="scroll-port">
        <div className="scrollable">
          {props.transactions.length == 0 && (
            <div className="empty-records">
              <Text>No transactions available right now</Text>
            </div>
          )}
          {props.transactions
            .sort((a, b) => (a.origin > b.origin ? 1 : -1))
            .map((tx, index) => {
              return (
                <MiniTransaction
                  key={tx.token.address}
                  transaction={tx}
                  txFactory={() => props.txHook(tx.token.ibcDenom)}
                  cantoAddress={props.cantoAddress}
                  ethAddress={props.ethAddress}
                />
              );
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

  .empty-records {
    border: 1px solid #333;
    background-color: #111;
    border-radius: 4px;
    padding: 1rem;
    p {
      color: #777;
    }
  }
  .scrollable {
    width: 100%;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
export default Step2TxBox;

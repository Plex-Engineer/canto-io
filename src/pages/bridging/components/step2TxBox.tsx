import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { TransactionStore } from "global/stores/transactionStore";
import { completeAllConvertIn, convertTx } from "../utils/transactions";
import MiniConvert from "./miniConvert";
import { formatUnits } from "ethers/lib/utils";
import { NativeTransaction } from "../config/bridgingInterfaces";

interface Step2TxBoxProps {
  bridgeIn: boolean;
  transactions: NativeTransaction[];
  cantoAddress: string;
  ethAddress: string;
  txStore: TransactionStore;
  chainId: number;
}
const Step2TxBox = (props: Step2TxBoxProps) => {
  return (
    <Styled>
      {props.transactions.length > 0 && props.bridgeIn && (
        <PrimaryButton
          onClick={() =>
            completeAllConvertIn(
              props.chainId,
              props.txStore,
              props.cantoAddress,
              props.transactions
            )
          }
        >
          Complete All
        </PrimaryButton>
      )}
      <Text type="title" size="title2">
        Bridge Queue
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
          {props.bridgeIn &&
            props.transactions
              .sort((a, b) => (a.origin > b.origin ? 1 : -1))
              .map((tx) => {
                return (
                  <MiniConvert
                    key={tx.token.address}
                    transaction={tx}
                    cantoAddress={props.cantoAddress}
                    ethAddress={props.ethAddress}
                    tx={() =>
                      convertTx(
                        props.chainId,
                        props.txStore,
                        props.bridgeIn,
                        props.cantoAddress,
                        tx.token.ibcDenom,
                        tx.amount.toString(),
                        {
                          icon: tx.token.icon,
                          symbol: tx.token.symbol,
                          amount: formatUnits(tx.amount, tx.token.decimals),
                        }
                      )
                    }
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

  @media (max-width: 1000px) {
    width: 100%;
    /* margin: 0 1rem; */
    padding: 12px;
  }
`;
export default Step2TxBox;

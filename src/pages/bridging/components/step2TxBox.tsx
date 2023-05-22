import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { BridgeNetworkPair, NativeTransaction } from "../config/interfaces";
import MiniTransaction from "./miniTransaction";
import { TransactionStore } from "global/stores/transactionStore";
import {
  completeAllConvertIn,
  convertTx,
  ibcOutTx,
} from "../utils/transactions";
import { formatUnits } from "ethers/lib/utils";

interface Step2TxBoxProps {
  transactions: NativeTransaction[];
  cantoAddress: string;
  ethAddress: string;
  bridgeIn: boolean;
  txStore: TransactionStore;
  chainId: number;
  networkPair: BridgeNetworkPair;
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
          {props.transactions
            .sort((a, b) => (a.origin > b.origin ? 1 : -1))
            .map((tx) => {
              return (
                <MiniTransaction
                  key={tx.token.address}
                  correctChainId={props.networkPair.receiving.network.chainId}
                  transaction={tx}
                  cantoAddress={props.cantoAddress}
                  ethAddress={props.ethAddress}
                  recover={false}
                  isIBCTransfer={!props.bridgeIn}
                  networkPair={props.networkPair}
                  tx={
                    props.bridgeIn
                      ? () =>
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
                      : (bridgeOutNetwork, address) =>
                          ibcOutTx(
                            props.chainId,
                            props.txStore,
                            bridgeOutNetwork,
                            address,
                            tx.token.ibcDenom,
                            tx.amount.toString(),
                            {
                              symbol: `${tx.token.symbol} to ${bridgeOutNetwork.name}`,
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

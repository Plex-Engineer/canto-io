import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { useEffect, useMemo, useState } from "react";
import { NativeTransaction } from "../config/interfaces";
import MiniTransaction from "./miniTransaction";
import { useTransactionStore } from "global/stores/transactionStore";
import { convertTx, ibcOutTx } from "../utils/transactions";
import { CantoMainnet } from "global/config/networks";
import { chain, convertFee, ibcFee } from "global/config/cosmosConstants";
import { formatUnits } from "ethers/lib/utils";

interface Step2TxBoxProps {
  transactions: NativeTransaction[];
  cantoAddress: string;
  ethAddress: string;
  bridgeIn: boolean;
}
const Step2TxBox = (props: Step2TxBoxProps) => {
  const txStore = useTransactionStore();
  //used to keep completed transactions on the screen until the user refreshes
  const [storedTxs, setStoredTxs] = useState(props.transactions);
  useEffect(() => {
    if (props.transactions.length >= storedTxs.length) {
      setStoredTxs(props.transactions);
    }
  }, [props.transactions.length]);
  const sortedTxs = useMemo(
    () => storedTxs.sort((a, b) => (a.origin > b.origin ? 1 : -1)),
    [storedTxs]
  );
  return (
    <Styled>
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
          {storedTxs.length == 0 && (
            <div className="empty-records">
              <Text>No transactions available right now</Text>
            </div>
          )}
          {sortedTxs.map((tx) => {
            return (
              <MiniTransaction
                key={tx.token.address}
                transaction={tx}
                cantoAddress={props.cantoAddress}
                ethAddress={props.ethAddress}
                recover={false}
                isIBCTransfer={!props.bridgeIn}
                tx={
                  props.bridgeIn
                    ? () =>
                        convertTx(
                          txStore,
                          props.bridgeIn,
                          props.cantoAddress,
                          tx.token.ibcDenom,
                          tx.amount.toString(),
                          CantoMainnet.cosmosAPIEndpoint,
                          convertFee,
                          chain,
                          "",
                          {
                            icon: tx.token.icon,
                            symbol: tx.token.symbol,
                            readableAmount: formatUnits(
                              tx.amount,
                              tx.token.decimals
                            ),
                          }
                        )
                    : (bridgeOutNetwork, address) =>
                        ibcOutTx(
                          txStore,
                          bridgeOutNetwork,
                          address,
                          tx.token.ibcDenom,
                          tx.amount.toString(),
                          CantoMainnet.cosmosAPIEndpoint,
                          ibcFee,
                          chain,
                          ""
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

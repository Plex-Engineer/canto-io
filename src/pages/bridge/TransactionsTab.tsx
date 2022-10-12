import styled from "@emotion/styled";
import { Event } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import TransactionBox from "./components/TransactionBox";
import {
  findGravityToken,
  getAllBridgeTransactionsForUser,
} from "./utils/utils";

const TransactionsTab = () => {
  const networkInfo = useNetworkInfo();
  const [pendingBridgeTransactions, setPendingBridgeTransactions] = useState<
    Event[]
  >([]);
  const [completedBridgeTransactions, setCompletedBridgeTransactions] =
    useState<Event[]>([]);

  async function getData() {
    const [completedBridgeIn, pendingBridgeIn] =
      await getAllBridgeTransactionsForUser(networkInfo.account);
    setCompletedBridgeTransactions(completedBridgeIn);
    setPendingBridgeTransactions(pendingBridgeIn);
  }
  useEffect(() => {
    getData();
  }, [networkInfo.account]);

  // useEffect(() => {
  //   filterTransactionSuccess(completedBridgeTransactions);
  // }, [completedBridgeTransactions.length]);

  // async function filterTransactionSuccess(tx: any[]) {
  //   if (tx.length == 0) return;
  //   let localTransactions = tx;
  //   for (const t of tx) {
  //     const txReceipt = await t.getTransactionReceipt();
  //     if (txReceipt.status != 1) {
  //       localTransactions = localTransactions.filter((x) => {
  //         return x != t;
  //       });
  //       localTransactions.push({ ...t, statusError: "failed" });
  //     }
  //   }
  //   setCompletedBridgeTransactions(localTransactions);
  // }
  return (
    <Styled>
      <Text
        type="title"
        color="primary"
        style={{
          fontFamily: "Silkscreen",
          lineHeight: "3rem",
          fontSize: "44px",
          fontWeight: "400",
          letterSpacing: "-0.08em",
        }}
      >
        {pendingBridgeTransactions.length != 0 ? "In Progress" : ""}
      </Text>
      {pendingBridgeTransactions
        .map((tx) => {
          const token = findGravityToken(tx.args?._tokenContract);
          return (
            <TransactionBox
              balance={formatUnits(tx.args?._amount, token?.decimals)}
              id={tx.blockNumber}
              status={"loading"}
              symbol={token?.symbol ?? "unknown"}
              txnValue={tx.transactionHash}
              type={"in"}
              key={tx.blockNumber}
            />
          );
        })
        .sort((a: any, b: any) => (a.props.id > b.props.id ? -1 : 1))}
      <Text
        type="title"
        color="primary"
        style={{
          fontFamily: "Silkscreen",
          lineHeight: "3rem",
          fontSize: "44px",
          fontWeight: "400",
          letterSpacing: "-0.08em",
        }}
      >
        {completedBridgeTransactions.length != 0 ? "complete" : ""}
      </Text>
      {completedBridgeTransactions
        .map((tx) => {
          const token = findGravityToken(tx.args?._tokenContract);
          return (
            <TransactionBox
              balance={formatUnits(tx.args?._amount, token?.decimals)}
              id={tx.blockNumber}
              status={"complete"}
              symbol={token?.symbol ?? "unknown"}
              txnValue={tx.transactionHash}
              type={"in"}
              key={tx.blockNumber}
            />
          );
        })
        .sort((a: any, b: any) => (a.props.id > b.props.id ? -1 : 1))}
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
  min-height: 48rem;
  text-shadow: none;
`;

export default TransactionsTab;

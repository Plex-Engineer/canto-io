import styled from "@emotion/styled";
import { Event } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { useNetworkInfo } from "global/stores/networkInfo";
import { useEffect, useState } from "react";
import TransactionBox from "./components/TransactionBox";
import warningIcon from "assets/warning.svg";

import {
  EventWithTime,
  findGravityToken,
  getAllBridgeTransactionsWithStatus,
  getBridgeOutTransactions,
} from "./utils/utils";

interface EventOut {
  token:
    | {
        symbol: string;
        name: string;
        decimals: number;
        address: string;
        isERC20: boolean;
        isLP: boolean;
        icon: string;
        cTokenAddress: string;
      }
    | undefined;
  amount: any;
  tx: any;
}

const TransactionsTab = () => {
  const networkInfo = useNetworkInfo();
  const [pendingBridgeTransactions, setPendingBridgeTransactions] = useState<
    Event[]
  >([]);
  const [completedBridgeTransactions, setCompletedBridgeTransactions] =
    useState<EventWithTime[]>([]);
  const [bridgeOutTransactions, setBridgeOutTransactions] = useState<any[]>([]);

  async function getData() {
    const [completedBridgeIn, pendingBridgeIn] =
      await getAllBridgeTransactionsWithStatus(
        networkInfo.account,
        networkInfo.cantoAddress
      );
    setCompletedBridgeTransactions(completedBridgeIn);
    setPendingBridgeTransactions(pendingBridgeIn);

    setBridgeOutTransactions(
      await getBridgeOutTransactions(networkInfo.cantoAddress)
    );
  }
  useEffect(() => {
    getData();
  }, [networkInfo.account, networkInfo.cantoAddress]);

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

  const completedBridgeIn = completedBridgeTransactions.map((tx) => {
    const token = findGravityToken(tx.args?._tokenContract);
    return (
      <TransactionBox
        balance={formatUnits(tx.args?._amount, token?.decimals)}
        id={new Date(tx.timestamp).toLocaleDateString()}
        status={"complete"}
        symbol={token?.symbol ?? "unknown"}
        txnValue={tx.transactionHash}
        type={"in"}
        key={tx.blockNumber}
      />
    );
  });
  const completedBridgeOut = bridgeOutTransactions.map((tx) => {
    return (
      <TransactionBox
        balance={formatUnits(tx.amount, tx.token.decimals)}
        id={new Date(tx.tx.timestamp).toLocaleDateString()}
        status={"complete"}
        symbol={tx.token.symbol}
        txnValue={tx.tx.transactionHash}
        type={"out"}
        key={tx.tx.transactionHash}
      />
    );
  });
  return (
    <Styled>
      {completedBridgeTransactions.length +
        bridgeOutTransactions.length +
        pendingBridgeTransactions.length ==
        0 && (
        <NotConnected
          title="No Trasacntions"
          subtext="You haven't made any transactions using bridging yet."
          buttonText="Get Started"
          bgFilled
          onClick={() => {
            // activateBrowserWallet();
            // addNetwork();
          }}
          icon={warningIcon}
        />
      )}
      <Text
        type="title"
        color="primary"
        style={{
          fontFamily: "Silkscreen",
          lineHeight: "3rem",
          fontSize: "26px",
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
        .sort((a: JSX.Element, b: JSX.Element) =>
          a.props.id > b.props.id ? -1 : 1
        )}
      <Text
        type="title"
        color="primary"
        style={{
          fontFamily: "Silkscreen",
          lineHeight: "3rem",
          fontSize: "26px",
          fontWeight: "400",
          letterSpacing: "-0.08em",
        }}
      >
        {completedBridgeTransactions.length + bridgeOutTransactions.length != 0
          ? "complete"
          : ""}
      </Text>
      {[...completedBridgeIn, ...completedBridgeOut].sort(
        (a: JSX.Element, b: JSX.Element) =>
          new Date(a.props.id) > new Date(b.props.id) ? -1 : 1
      )}
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
`;

export default TransactionsTab;

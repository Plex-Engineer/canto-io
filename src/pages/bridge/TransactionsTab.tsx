import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { useEffect } from "react";
import TransactionBox from "./components/TransactionBox";
import warningIcon from "assets/warning.svg";
import { findGravityToken } from "./utils/utils";
import { useBridgeTransactionStore } from "./stores/transactionStore";

const TransactionsTab = () => {
  const transactionStore = useBridgeTransactionStore();
  const pendingBridgeTransactions =
    transactionStore.transactions.pendingBridgeTransactions;
  const completedBridgeTransactions =
    transactionStore.transactions.completedBridgeTransactions;
  const bridgeOutTransactions =
    transactionStore.transactions.bridgeOutTransactions;

  useEffect(() => {
    if (transactionStore.newTransactions) {
      transactionStore.setNewTransactions(0);
    }
  }, []);

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
    const token = findGravityToken(tx.args?.[0]);
    return (
      <TransactionBox
        balance={formatUnits(tx.args?.[3], token?.decimals)}
        id={new Date(tx.timestamp).toLocaleDateString()}
        status={"complete"}
        symbol={token?.symbol ?? "unknown"}
        blockExplorerUrl={"https://etherscan.io/tx/" + tx.transactionHash}
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
        blockExplorerUrl={"https://ping.pub/canto/tx/" + tx.tx.txhash}
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
          title="No Transactions"
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
          const token = findGravityToken(tx.args?.[0]);
          return (
            <TransactionBox
              balance={formatUnits(tx.args?.[3], token?.decimals)}
              id={tx.blockNumber}
              status={"loading"}
              symbol={token?.symbol ?? "unknown"}
              blockExplorerUrl={"https://etherscan.io/tx/" + tx.transactionHash}
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

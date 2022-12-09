import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { useEffect } from "react";
import TransactionBox from "./components/TransactionBox";
import warningIcon from "assets/warning.svg";
import { findGravityToken } from "./utils/utils";
import { useBridgeTransactionStore } from "./stores/transactionStore";
import { Mixpanel } from "mixpanel";

const Transactions = () => {
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
    Mixpanel.events.bridgeActions.transactionPageOpened();
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
        key={tx.transactionHash}
        balance={formatUnits(tx.args?.[3], token?.decimals)}
        status={"complete"}
        symbol={token?.symbol ?? "unknown"}
        blockExplorerUrl={"https://etherscan.io/tx/" + tx.transactionHash}
        type={"in"}
        timestamp={tx.timestamp * 1000}
      />
    );
  });
  const completedBridgeOut = bridgeOutTransactions.map((tx) => {
    return (
      <TransactionBox
        key={tx.tx.txhash}
        balance={formatUnits(tx.amount, tx.token?.decimals)}
        status={"complete"}
        symbol={tx.token?.symbol ?? "unknown"}
        blockExplorerUrl={"https://ping.pub/canto/tx/" + tx.tx.txhash}
        type={"out"}
        timestamp={tx.tx.timestamp}
      />
    );
  });
  return (
    <Styled>
      {completedBridgeTransactions.length +
        bridgeOutTransactions.length +
        pendingBridgeTransactions.length ==
        0 &&
        transactionStore.oldTransactionLength == 0 && (
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
      {pendingBridgeTransactions.length != 0 ? (
        <Text type="title" color="primary" size="title2">
          In Progress
        </Text>
      ) : null}
      {pendingBridgeTransactions
        .map((tx) => {
          const token = findGravityToken(tx.args?.[0]);
          return (
            <TransactionBox
              key={tx.blockNumber}
              balance={formatUnits(tx.args?.[3], token?.decimals)}
              status={"loading"}
              symbol={token?.symbol ?? "unknown"}
              blockExplorerUrl={"https://etherscan.io/tx/" + tx.transactionHash}
              type={"in"}
              timestamp={tx.timestamp * 1000}
              secondsUntilConfirmed={tx.secondsUntilConfirmed}
            />
          );
        })
        .sort((a: JSX.Element, b: JSX.Element) =>
          a.props.id > b.props.id ? -1 : 1
        )}
      <Text type="title" color="primary" size="title2">
        {completedBridgeTransactions.length + bridgeOutTransactions.length != 0
          ? "complete"
          : ""}
      </Text>
      {[...completedBridgeIn, ...completedBridgeOut].sort(
        (a: JSX.Element, b: JSX.Element) =>
          new Date(a.props.timestamp) > new Date(b.props.timestamp) ? -1 : 1
      )}
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 60px 0;
  max-width: 600px;
  flex-grow: 1;

  @media (max-width: 1000px) {
    max-width: 100%;
    margin: 0 1rem;
  }
`;

export default Transactions;

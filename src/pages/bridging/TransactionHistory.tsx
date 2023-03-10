import styled from "@emotion/styled";
import warningIcon from "assets/warning.svg";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { useNavigate } from "react-router-dom";
import TransactionHistoryBox from "./components/transactionHistoryBox";
import { AllBridgeTxHistory } from "./hooks/useTransactionHistory";

interface TransactionHistoryProps {
  allTransactions: AllBridgeTxHistory;
}
const Transactions = (props: TransactionHistoryProps) => {
  const navigate = useNavigate();
  const completeTransactions = [
    ...props.allTransactions.completeBridgeInTransactions,
    ...props.allTransactions.bridgeOutTransactions,
  ];
  return (
    <Styled>
      {" "}
      {props.allTransactions.completeBridgeInTransactions.length +
        props.allTransactions.bridgeOutTransactions.length +
        props.allTransactions.pendingBridgeInTransactions.length ==
        0 && (
        <NotConnected
          title="No Transactions"
          subtext="You haven't made any transactions using bridging yet."
          buttonText="Get Started"
          bgFilled
          onClick={() => {
            navigate("/bridge/walkthrough");
          }}
          icon={warningIcon}
        />
      )}
      {props.allTransactions.pendingBridgeInTransactions.length != 0 && (
        <>
          <Text type="title" color="primary" size="title2">
            In Progress
          </Text>
          {props.allTransactions.pendingBridgeInTransactions
            .sort((a, b) =>
              new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
            )
            .map((tx) => {
              return <TransactionHistoryBox key={tx.txHash} tx={tx} />;
            })}
        </>
      )}
      {completeTransactions.length != 0 && (
        <>
          <Text type="title" color="primary" size="title2">
            complete
          </Text>
          {completeTransactions
            .sort((a, b) =>
              new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
            )
            .map((tx) => {
              return <TransactionHistoryBox key={tx.txHash} tx={tx} />;
            })}
        </>
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

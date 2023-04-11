import styled from "@emotion/styled";
import warningIcon from "assets/warning.svg";
import { Text } from "global/packages/src";
import NotConnected from "global/packages/src/components/molecules/NotConnected";
import { useNavigate } from "react-router-dom";
import TransactionHistoryBox from "./components/transactionHistoryBox";
import { AllBridgeTxHistory } from "./hooks/useTransactionHistory";
import Select from "react-select";
import { Selected } from "pages/staking/modals/redelgationModal";
import { useState } from "react";
interface TransactionHistoryProps {
  allTransactions: AllBridgeTxHistory;
}
const Transactions = (props: TransactionHistoryProps) => {
  const navigate = useNavigate();
  const noTransactions: boolean =
    props.allTransactions.completeBridgeInTransactions.length +
      props.allTransactions.bridgeOutTransactions.length +
      props.allTransactions.pendingBridgeInTransactions.length ==
    0;
  const [userDisplayOption, setUserDisplayOption] = useState(1);
  const displayTxOptions = [
    {
      label: "all",
      value: 1,
    },
    {
      label: "bridge in",
      value: 2,
    },
    {
      label: "bridge out",
      value: 3,
    },
  ];
  const completeBridgeIn =
    userDisplayOption !== 3
      ? props.allTransactions.completeBridgeInTransactions
      : [];
  const completeBridgeOut =
    userDisplayOption !== 2 ? props.allTransactions.bridgeOutTransactions : [];

  const completeTransactions = [...completeBridgeIn, ...completeBridgeOut];
  const pendingTx =
    userDisplayOption !== 3
      ? props.allTransactions.pendingBridgeInTransactions
      : [];
  return (
    <Styled>
      {" "}
      {noTransactions && (
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
      {!noTransactions && (
        <Selected
          style={{
            width: "18rem",
          }}
        >
          <Select
            className="react-select-container"
            styles={{
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "var(--primary-color)",
              }),
            }}
            classNamePrefix="react-select"
            options={displayTxOptions}
            onChange={(val) => {
              setUserDisplayOption(val?.value ?? 1);
            }}
            isSearchable={false}
            defaultValue={displayTxOptions[0]}
            placeholder="view options"
          />
        </Selected>
      )}
      {pendingTx.length != 0 && (
        <>
          <Text type="title" color="primary" size="title2">
            In Progress
          </Text>
          {pendingTx
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

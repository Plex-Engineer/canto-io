import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import TransactionBox from "./components/TransactionBox";

const TransactionsTab = () => {
  return (
    <Styled>
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
        In Progress
      </Text>
      <TransactionBox
        balance="1.75"
        id={234334}
        status={"loading"}
        symbol={"ETH"}
        txnValue="98237498234879"
        type="in"
        key={98798}
      />
      <TransactionBox
        balance="45.75"
        id={234334}
        status={"loading"}
        symbol={"ETH"}
        txnValue="98237498234879"
        type="out"
        key={9878}
      />
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
        complete
      </Text>
      <TransactionBox
        balance="45.75"
        id={234334}
        status={"complete"}
        symbol={"USDC"}
        txnValue="98237498234879"
        type="out"
        key={9878}
      />{" "}
      <TransactionBox
        balance="60000.45"
        id={234334}
        status={"complete"}
        symbol={"USTC"}
        txnValue="98237498234879"
        type="out"
        key={9878}
      />{" "}
      <TransactionBox
        balance="1.005"
        id={234334}
        status={"complete"}
        symbol={"ATOM"}
        txnValue="98237498234879"
        type="out"
        key={9878}
      />{" "}
      <TransactionBox
        balance="12.34"
        id={234334}
        status={"complete"}
        symbol={"ETH"}
        txnValue="98237498234879"
        type="out"
        key={9878}
      />
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

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { LoadingOverlay } from "./supplyModal";
import { useToken } from "pages/lending/providers/activeTokenContext";
import { InputState, ReactiveButton } from "../reactiveButton";
import { formatBalance } from "global/utils/utils";
import LendingField from "../lendingField";
import { Details, TrasanctionType } from "../BorrowLimits";
import LoadingModal from "./loadingModal";

//STYLING
const Container = styled.div`
  display: flex;
  height: 90vh;
  max-height: 45.6rem;
  width: 400px;
  flex-direction: column;
  align-items: stretch;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1rem;
  }
  .tabs {
    margin: 16px;
  }

  .tablist {
    list-style: none;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--primary-color);
    padding: 0;
    color: #efefef;
    font-weight: 400;
    .tab {
      flex: 1;
      cursor: pointer;
      padding: 0.5rem;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:hover:not(.selected) {
        background: #a7efd218;
      }
      &:focus {
        outline: none;
      }
    }
  }

  .selected {
    background: rgba(6, 252, 153, 0.15);
    border-radius: 1px;
    color: var(--primary-color);
  }
`;

export const Wallet = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 1.3rem 0;
  border-top: 1px solid #222;
  padding-top: 1rem;
  p:first-child {
    font-weight: 300;
    font-size: 16px;
    color: #dfdfdf;
  }
  p:last-child {
    font-weight: 300;
    font-size: 16px;
    color: var(--primary-color);
  }
`;

interface IProps {
  onClose: () => void;
}
const BorrowModal = ({ onClose }: IProps) => {
  const tokenState = useToken();
  const token = tokenState[0].token;
  const stats = tokenState[0].stats;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isRepaying, setIsRepaying] = useState(true);

  const [inputState, setInputState] = useState(InputState.ENTERAMOUNT);

  const [amount, setAmount] = useState("");
  const [isMax, setMax] = useState(false);

  function resetInput() {
    //if in repay tab and allowance is true or if borrowing is true
    console.log("in repay tab " + isRepaying);
    if ((isRepaying && token.allowance) || !isRepaying) {
      setInputState(InputState.ENTERAMOUNT);
    } else {
      setInputState(InputState.ENABLE);
    }

    setAmount("");
  }

  function repayValidation(value: string, amount: number) {
    if (value == "") {
      setAmount("");
    }
    //TODO: if not enabled or borrow modal
    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (value.length < 1 || Number(value) == 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (Math.abs(Number(value)) > amount) {
        setAmount(value);

        setInputState(InputState.NOFUNDS);
      } else {
        setAmount(value);

        setInputState(InputState.CONFIRM);
      }
    }
  }
  function borrowValidation(value: string, maxAmount: number) {
    if (value == "") {
      setAmount("");
    }

    //TODO: if not enabled or borrow modal
    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (ExpectedBorrowLimitUsedIfBorrowing(Number(value)) > 100) {
        setAmount(value);

        setInputState(InputState.NOFUNDS);
      } else if (
        (value.length < 1 || Number(value) == 0) &&
        ExpectedBorrowLimitUsedIfBorrowing(Number(value)) <= 100
      ) {
        setInputState(InputState.ENTERAMOUNT);
      } else {
        setAmount(value);

        setInputState(InputState.CONFIRM);
      }
    }
  }

  function WalletForBorrow() {
    return (
      <Wallet>
        <p>currently borrowing</p>
        <p>
          {formatBalance(token.borrowBalance)} {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }

  function borrowAmount() {
    return (stats.totalBorrowLimit * 0.8 - stats.totalBorrow) / token.price;
  }

  function WalletForRepay() {
    return (
      <Wallet>
        <p>wallet balance</p>
        <p>
          {formatBalance(token.balanceOf)} {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }

  //Hypothetical Borrow Balance if Borrowing
  function ExpectedBorrowBalanceIfBorrowing(amount: number) {
    return stats.totalBorrowLimitUsed + token.price * amount;
  }

  //Hypothetical Borrow Limit Used If Borrowing
  function ExpectedBorrowLimitUsedIfBorrowing(amount: number) {
    return (
      (ExpectedBorrowBalanceIfBorrowing(amount) / stats.totalBorrowLimit) * 100
    );
  }

  const BorrowTab = () => {
    return (
      <TabPanel>
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        {/* borrow */}
        <LendingField
          onMax={(value) => {
            if (inputState != InputState.ENABLE) {
              const val = borrowAmount();

              if (val > 0) {
                setInputState(InputState.CONFIRM);
              } else {
                setInputState(InputState.ENTERAMOUNT);
              }
              setAmount(val.toFixed(token.data.underlying.decimals));
              setMax(true);
            }
          }}
          limit={borrowAmount() > 0 ? borrowAmount() : 0}
          value={amount}
          onChange={(value) => {
            borrowValidation(value, token.supplyBalance);
            setMax(false);
          }}
          transactionType={TrasanctionType.BORROW}
          token={token}
          type={token.data.underlying.name}
          balance={token.balanceOf}
        />
        {/* 1st tab */}
        <Details
          transactionType={TrasanctionType.BORROW}
          amount={Number(amount)}
          token={token}
          icon={token.data.underlying.icon}
          isBorrowing={true}
          borrowLimit={stats.totalBorrowLimit}
          borrowBalance={stats.totalBorrowLimitUsed}
          borrowLimitUsed={Number(
            (
              (stats.totalBorrowLimitUsed / stats.totalBorrowLimit) *
              100
            ).toFixed(2)
          )}
        />

        <ReactiveButton
          transactionType={TrasanctionType.BORROW}
          state={inputState}
          token={token}
          amount={amount}
          isEth={token.data.symbol == "cCANTO"}
          max={isMax}
          onTransaction={(e) => {
            setTransaction(e);
          }}
        />

        {WalletForBorrow()}
      </TabPanel>
    );
  };
  const RepayTab = () => {
    return (
      <TabPanel>
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        <LendingField
          token={token}
          value={amount}
          transactionType={TrasanctionType.REPAY}
          limit={Math.min(token.balanceOf, token.borrowBalance)}
          //repay
          onMax={(value) => {
            if (inputState != InputState.ENABLE) {
              //check if we are in the withdraw state
              const val = Math.min(token.balanceOf, token.borrowBalance);
              setAmount(val.toString());
              setMax(true);
              setInputState(InputState.CONFIRM);
            }
          }}
          onChange={(value) => {
            repayValidation(
              value,
              Math.min(token.balanceOf, token.borrowBalance)
            );
            setMax(false);
          }}
          balance={token.borrowBalance}
        />
        {/* 2nd tab */}
        <Details
          transactionType={TrasanctionType.REPAY}
          icon={token.data.underlying.icon}
          token={token}
          amount={Number(amount)}
          borrowLimit={stats.totalBorrowLimit}
          borrowLimitUsed={Number(
            (
              (stats.totalBorrowLimitUsed / stats.totalBorrowLimit) *
              100
            ).toFixed(2)
          )}
          borrowBalance={stats.totalBorrowLimitUsed}
          isBorrowing={true}
        />
        <ReactiveButton
          onTransaction={(e) => {
            setTransaction(e);
          }}
          max={isMax}
          isEth={token.data.symbol == "cCANTO"}
          state={inputState}
          token={token}
          amount={amount}
          transactionType={
            inputState != InputState.ENABLE
              ? TrasanctionType.REPAY
              : TrasanctionType.ENABLE
          }
        />

        {WalletForRepay()}
      </TabPanel>
    );
  };

  useEffect(() => {
    if (
      ["Success", "Fail", "Exception"].includes(transaction?.status ?? "none")
    ) {
      setTimeout(onClose, 1000);
    }
  }, [transaction?.status]);

  return (
    <Container>
      {/* 'None' , 'PendingSignature' , 'Mining' , 'Success' , 'Fail' , 'Exception' */}
      {["PendingSignature", "Mining", "Success", "Fail", "Exception"].includes(
        transaction?.status ?? "none"
      ) ? (
        <LoadingOverlay>
          <LoadingModal
            isLoading
            modalText="borrowing bat"
            status={transaction?.status}
          />
        </LoadingOverlay>
      ) : null}

      <div className="title">
        <img
          style={{
            width: "26px",
            height: "26px",
          }}
          src={token.data.underlying.icon}
          alt={token.data.underlying.name}
        />
        <p
          style={{
            fontWeight: "300",
            fontSize: "18px",
            letterSpacing: "-0.03em",
            color: "white",
          }}
        >
          {token.data.underlying.name}
          {/* {transaction?.status ?? "test"} */}
        </p>
      </div>
      <Tabs
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}
      >
        <TabList className={"tablist"}>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsRepaying(true);
              resetInput();
            }}
          >
            borrow
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsRepaying(false);
              resetInput();
            }}
          >
            repay
          </Tab>
        </TabList>
        {BorrowTab()}
        {/* New Tab ================================== */}
        {RepayTab()}
      </Tabs>
    </Container>
  );
};
export default BorrowModal;

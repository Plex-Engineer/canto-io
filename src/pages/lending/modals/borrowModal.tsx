import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { LoadingOverlay } from "./supplyModal";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import LendingField from "../components/lendingField";
import { Details, TrasanctionType } from "../components/BorrowLimits";
import LoadingModal from "./loadingModal";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { maxBorrowInUnderlying } from "pages/lending/utils/borrowRepayLimits";
import { BigNumber } from "ethers";

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

  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Wallet = styled.div`
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
  position: UserLMPosition;
}
const BorrowModal = ({ onClose, position }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isRepaying, setIsRepaying] = useState(true);
  const [isMax, setMax] = useState(false);

  const [inputState, setInputState] = useState(InputState.ENTERAMOUNT);

  const [userAmount, setUserAmount] = useState("");

  function resetInput() {
    //if in repay tab and allowance is true or if borrowing is true
    if ((isRepaying && token.allowance) || !isRepaying) {
      setInputState(InputState.ENTERAMOUNT);
    } else {
      setInputState(InputState.ENABLE);
    }

    setUserAmount("");
  }

  function inputValidation(value: string, max: BigNumber) {
    value = truncateNumber(value, token.data.underlying.decimals);
    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (value.length < 1 || Number(value) == 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
      } else {
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function WalletForBorrow() {
    return (
      <Wallet>
        <p>currently borrowing</p>
        <p>
          {truncateNumber(
            formatUnits(token.borrowBalance, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }

  function WalletForRepay() {
    return (
      <Wallet>
        <p>wallet balance</p>
        <p>
          {truncateNumber(
            formatUnits(token.balanceOf, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }

  const BorrowTab = () => {
    const borrowLimit80 = maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      80,
      token.price
    );
    const borrowLimit100 = maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      100,
      token.price
    );
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
          token={token}
          value={userAmount}
          transactionType={TrasanctionType.BORROW}
          canDoMax={false}
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setMax(true);
              if (borrowLimit80.lte(0)) {
                setInputState(InputState.ENTERAMOUNT);
                setUserAmount("0");
              } else {
                setUserAmount(
                  formatUnits(borrowLimit80, token.data.underlying.decimals)
                );
                setInputState(InputState.CONFIRM);
              }
            }
          }}
          onChange={(value) => {
            setUserAmount(value);
            inputValidation(value, borrowLimit100);
            setMax(false);
          }}
          balance={truncateNumber(
            formatUnits(token.borrowBalance, token.data.underlying.decimals)
          )}
        />
        {/* 1st tab */}
        <Details
          transactionType={TrasanctionType.BORROW}
          stringAmount={truncateNumber(
            userAmount,
            token.data.underlying.decimals
          )}
          token={token}
          icon={token.data.underlying.icon}
          isBorrowing={true}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
        />

        <ReactiveButton
          transactionType={TrasanctionType.BORROW}
          state={inputState}
          token={token}
          amount={userAmount}
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
    const repayLimit = token.balanceOf.lt(token.borrowBalance)
      ? token.balanceOf
      : token.borrowBalance;
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
          value={userAmount}
          transactionType={TrasanctionType.REPAY}
          canDoMax={true}
          //repay
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setUserAmount(
                formatUnits(repayLimit, token.data.underlying.decimals)
              );
              setMax(true);
              setInputState(InputState.CONFIRM);
            }
          }}
          onChange={(value) => {
            setUserAmount(value);
            inputValidation(value, repayLimit);
            setMax(false);
          }}
          balance={truncateNumber(
            formatUnits(token.borrowBalance, token.data.underlying.decimals)
          )}
        />
        {/* 2nd tab */}
        <Details
          transactionType={TrasanctionType.REPAY}
          stringAmount={truncateNumber(
            userAmount,
            token.data.underlying.decimals
          )}
          icon={token.data.underlying.icon}
          token={token}
          isBorrowing={true}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
        />
        <ReactiveButton
          onTransaction={(e) => {
            setTransaction(e);
          }}
          max={isMax}
          isEth={token.data.symbol == "cCANTO"}
          state={inputState}
          token={token}
          amount={userAmount}
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

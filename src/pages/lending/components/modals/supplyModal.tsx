import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import LendingField from "../lendingField";
import { useState, useEffect } from "react";
import { Details, TrasanctionType } from "../BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../reactiveButton";
import LoadingModal from "./loadingModal";
import { formatBalance } from "global/utils/utils";
import useModalStore from "pages/lending/stores/useModals";

//STYLING
export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0%;
  bottom: 0%;
  width: 400px;
  max-height: 45.6rem;
  background-color: black;
  @media (max-width: 1000px) {
    width: 99vw;
  }
`;
const Container = styled.div`
  display: flex;
  max-height: 45.6rem;
  height: 90vh;
  width: 400px;
  flex-direction: column;
  align-items: stretch;
  position: relative;
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

const SupplyModal = ({ onClose }: IProps) => {
  const modalStore = useModalStore();
  const stats: any = modalStore.stats;
  const token: any = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isMax, setMax] = useState(false);

  const [inputState, setInputState] = useState(
    !token.allowance ? InputState.ENABLE : InputState.ENTERAMOUNT
  );

  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (
      ["Success", "Fail", "Exception"].includes(transaction?.status ?? "none")
    ) {
      setTimeout(onClose, 1000);
    }
  }, [transaction?.status]);

  function resetInput() {
    //if in supply tab and allowance is true or if withdraw is true
    console.log("withdrawing " + isWithdrawing);
    if ((!isWithdrawing && token.allowance) || isWithdrawing) {
      setInputState(InputState.ENTERAMOUNT);
    } else {
      setInputState(InputState.ENABLE);
    }

    setAmount("");
  }

  function supplyValidation(value: string, max: number) {
    if (value == "") {
      setAmount("");
    }
    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (value.length < 1 || Number(value) == 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (Math.abs(Number(value)) > max) {
        setInputState(InputState.NOFUNDS);
      } else {
        setAmount(value);
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function withdrawValidation(value: string, max: number) {
    if (value == "") {
      setAmount("");
    }

    if (inputState !== InputState.ENABLE) {
      if (isNaN(Number(value))) {
        setInputState(InputState.INVALID);
      } else if (
        //Value has no be less than currently supplying, but if not collateralized, we do not care about expected borrowlimit used
        Math.abs(Number(value)) > max ||
        (token.collateral && ExpectedBorrowLimitUsed(Number(value)) > 1)
      ) {
        setAmount(value);
        setInputState(InputState.NOFUNDS);
      } else if (value.length < 1 || Number(value) == 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else {
        setAmount(value);
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function withdrawAmount() {
    return (
      (stats.totalBorrowLimit - stats.totalBorrowLimitUsed / 0.8) /
      token.price /
      token.collateralFactor
    );
  }

  function WalletForSupply() {
    return (
      <Wallet>
        <p>wallet balance</p>
        <p>
          {formatBalance(token.balanceOf)} {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }

  function WalletForWithdraw() {
    return (
      <Wallet>
        <p>currently supplying</p>
        <p>
          {formatBalance(token.supplyBalance)} {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
  }
  function ExpectedBorrowLimit(value: number) {
    const additionalBorrowLimit = token.collateralFactor * -value;
    const additionalBorrowLimitInNote = additionalBorrowLimit * token.price;
    return additionalBorrowLimitInNote + stats.totalBorrowLimit;
  }

  //Hypothetical Borrow Limit Used If About to supply/withdraw
  function ExpectedBorrowLimitUsed(value: number) {
    return stats.totalBorrowLimitUsed / ExpectedBorrowLimit(value);
  }

  const SupplyTab = () => {
    return (
      <TabPanel>
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        {/* supply */}
        <LendingField
          onMax={(value: string) => {
            if (inputState != InputState.ENABLE) {
              const val = value;
              if (Number(val) > 0) setInputState(InputState.CONFIRM);
              else {
                setInputState(InputState.ENTERAMOUNT);
              }
              setAmount(val);
              setMax(true);
            }
          }}
          limit={undefined}
          value={amount}
          onChange={(value) => {
            supplyValidation(value, token.balanceOf);
            setMax(false);
          }}
          transactionType={TrasanctionType.SUPPLY}
          token={token}
          type={token.data.underlying.name}
          balance={token.balanceOf}
        />
        {/* 1st tab */}
        <Details
          transactionType={TrasanctionType.SUPPLY}
          amount={Number(amount)}
          token={token}
          icon={token.data.underlying.icon}
          isBorrowing={false}
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
          onTransaction={(e) => {
            setTransaction(e);
          }}
          transactionType={
            inputState != InputState.ENABLE
              ? TrasanctionType.SUPPLY
              : TrasanctionType.ENABLE
          }
          state={inputState}
          max={isMax}
          token={token}
          isEth={token.data.symbol == "cCANTO"}
          amount={amount}
        />

        {WalletForSupply()}
      </TabPanel>
    );
  };
  const WithdrawTab = () => {
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
          transactionType={TrasanctionType.WITHDRAW}
          limit={
            !token.collateral
              ? undefined
              : withdrawAmount() < token.supplyBalance
              ? withdrawAmount() < 0
                ? 0
                : withdrawAmount()
              : undefined
          }
          //Withdraw
          onMax={(value) => {
            if (inputState != InputState.ENABLE) {
              //check if we are in the withdraw state
              let val = !token.collateral
                ? value
                : withdrawAmount() < token.supplyBalance
                ? withdrawAmount().toFixed(token.data.underlying.decimals)
                : value;
              val = Number(val) < 0 ? "0" : val;
              setAmount(val.toString());
              //Check that max was actually 100% of the balance
              token.supplyBalance > val ? setMax(false) : setMax(true);
              setInputState(InputState.CONFIRM);
            }
          }}
          onChange={(value) => {
            withdrawValidation(value, token.supplyBalance);
            setMax(false);
          }}
          balance={token.supplyBalance}
        />
        {/* 2nd tab */}
        <Details
          transactionType={TrasanctionType.WITHDRAW}
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
          isBorrowing={false}
        />
        <ReactiveButton
          onTransaction={(e) => {
            setTransaction(e);
          }}
          max={isMax}
          state={inputState}
          token={token}
          isEth={token.data.symbol == "cCANTO"}
          amount={amount}
          transactionType={TrasanctionType.WITHDRAW}
        />

        {WalletForWithdraw()}
      </TabPanel>
    );
  };

  return (
    <Container
      onScroll={(e) => {
        e.preventDefault();
        console.log("scrolling");
      }}
    >
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
              setIsWithdrawing(true);
              resetInput();
            }}
          >
            supply
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsWithdrawing(false);
              resetInput();
            }}
          >
            withdraw
          </Tab>
        </TabList>
        {SupplyTab()}

        {/* New Tab ================================== */}
        {WithdrawTab()}
      </Tabs>
    </Container>
  );
};
export default SupplyModal;

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import LendingField from "../lendingField";
import { useState, useEffect } from "react";
import { Details, TrasanctionType } from "../BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../reactiveButton";
import LoadingModal from "./loadingModal";
import { truncateNumber } from "global/utils/utils";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import {
  maxWithdrawalInUnderlying,
  userMaximumWithdrawal,
} from "pages/lending/utils/supplyWithdrawLimits";

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
  const position: UserLMPosition = modalStore.position;
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isMax, setMax] = useState(false);

  const [inputState, setInputState] = useState(
    !token.allowance ? InputState.ENABLE : InputState.ENTERAMOUNT
  );

  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    if (
      ["Success", "Fail", "Exception"].includes(transaction?.status ?? "none")
    ) {
      setTimeout(onClose, 1000);
    }
  }, [transaction?.status]);

  function resetInput() {
    //if in supply tab and allowance is true or if withdraw is true
    // console.log("withdrawing " + isWithdrawing);
    if ((!isWithdrawing && token.allowance) || isWithdrawing) {
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
      } else if (value.length < 1 || Number(value) <= 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
      } else {
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function WalletForSupply() {
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

  function WalletForWithdraw() {
    return (
      <Wallet>
        <p>currently supplying</p>
        <p>
          {truncateNumber(
            formatUnits(token.supplyBalance, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </Wallet>
    );
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
          token={token}
          value={userAmount}
          transactionType={TrasanctionType.SUPPLY}
          canDoMax={true}
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setUserAmount(
                formatUnits(token.balanceOf, token.data.underlying.decimals)
              );
              setMax(true);
              setInputState(InputState.CONFIRM);
            }
          }}
          onChange={(value) => {
            setUserAmount(value);
            inputValidation(value, token.balanceOf);
            setMax(false);
          }}
          balance={truncateNumber(
            formatUnits(token.balanceOf, token.data.underlying.decimals)
          )}
        />
        {/* 1st tab */}
        <Details
          transactionType={TrasanctionType.SUPPLY}
          stringAmount={truncateNumber(
            userAmount,
            token.data.underlying.decimals
          )}
          token={token}
          icon={token.data.underlying.icon}
          isBorrowing={false}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
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
          amount={userAmount}
        />

        {WalletForSupply()}
      </TabPanel>
    );
  };
  const WithdrawTab = () => {
    const [limit80Percent, withdrawalMax] = userMaximumWithdrawal(
      token.supplyBalance,
      token.data.underlying.decimals,
      position.totalBorrow,
      position.totalBorrowLimit,
      token.collateralFactor,
      token.price,
      token.collateral
    );
    const withdrawalLimit = maxWithdrawalInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      token.collateralFactor,
      100,
      token.price,
      token.data.underlying.decimals
    );
    console.log(formatUnits(withdrawalLimit, token.data.underlying.decimals))
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
          transactionType={TrasanctionType.WITHDRAW}
          canDoMax={withdrawalMax}
          //Withdraw
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setUserAmount(
                formatUnits(limit80Percent, token.data.underlying.decimals)
              );
              setMax(withdrawalMax);
              if (limit80Percent.isZero()) {
                setInputState(InputState.ENTERAMOUNT);
              } else {
                setInputState(InputState.CONFIRM);
              }
            }
          }}
          onChange={(value) => {
            setUserAmount(value);
            inputValidation(
              value,
              token.collateral && withdrawalLimit.lt(token.supplyBalance)
                ? withdrawalLimit
                : token.supplyBalance
            );
            setMax(false);
          }}
          balance={truncateNumber(
            formatUnits(token.supplyBalance, token.data.underlying.decimals)
          )}
        />
        {/* 2nd tab */}
        <Details
          transactionType={TrasanctionType.WITHDRAW}
          icon={token.data.underlying.icon}
          token={token}
          stringAmount={truncateNumber(
            userAmount,
            token.data.underlying.decimals
          )}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
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
          amount={userAmount}
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

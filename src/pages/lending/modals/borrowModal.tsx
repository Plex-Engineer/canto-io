import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import LendingField from "../components/lendingField";
import { Details } from "../components/BorrowLimits";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { maxBorrowInUnderlying } from "pages/lending/utils/borrowRepayLimits";
import { BigNumber } from "ethers";
import { SupplyBorrowContainer, ModalWallet } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
interface IProps {
  onClose: () => void;
  position: UserLMPosition;
}
const BorrowModal = ({ position, onClose }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isRepaying, setIsRepaying] = useState(false);
  const [isMax, setMax] = useState(false);

  const [inputState, setInputState] = useState(InputState.ENTERAMOUNT);

  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    resetInput();
  }, [isRepaying]);
  function resetInput() {
    //if in repay tab and allowance is true or if borrowing is true
    if (isRepaying && token.allowance.isZero()) {
      setInputState(InputState.ENABLE);
    } else {
      setInputState(InputState.ENTERAMOUNT);
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
      } else if (
        parseUnits(value, token.data.underlying.decimals).gt(token.allowance) &&
        isRepaying
      ) {
        setInputState(InputState.INCREASE_ALLOWANCE);
      } else {
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function WalletForBorrow() {
    return (
      <ModalWallet>
        <p>currently borrowing</p>
        <p>
          {truncateNumber(
            formatUnits(token.borrowBalance, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </ModalWallet>
    );
  }

  function WalletForRepay() {
    return (
      <ModalWallet>
        <p>wallet balance</p>
        <p>
          {truncateNumber(
            formatUnits(token.balanceOf, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </ModalWallet>
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
          transactionType={CantoTransactionType.BORROW}
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
            //no allowance needed for borrow, so validation not needed
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
          transactionType={CantoTransactionType.BORROW}
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
          transactionType={CantoTransactionType.BORROW}
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
          transactionType={CantoTransactionType.REPAY}
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
            inputValidation(
              formatUnits(repayLimit, token.data.underlying.decimals),
              repayLimit
            );
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
          transactionType={CantoTransactionType.REPAY}
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
            inputState == InputState.ENABLE ||
            inputState == InputState.INCREASE_ALLOWANCE
              ? CantoTransactionType.ENABLE
              : CantoTransactionType.REPAY
          }
        />

        {WalletForRepay()}
      </TabPanel>
    );
  };

  return (
    <SupplyBorrowContainer>
      {transaction?.status != "None" && transaction?.status && (
        <GlobalLoadingModal
          transactionType={
            inputState == InputState.ENABLE
              ? CantoTransactionType.ENABLE
              : inputState == InputState.INCREASE_ALLOWANCE
              ? CantoTransactionType.INCREASE_ALLOWANCE
              : isRepaying
              ? CantoTransactionType.REPAY
              : CantoTransactionType.BORROW
          }
          status={transaction.status}
          tokenName={token.data.underlying.symbol}
          txHash={transaction.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName: token.data.underlying.symbol,
            amount: userAmount,
            tokenPrice: formatUnits(
              token.price,
              36 - token.data.underlying.decimals
            ),
          }}
        />
      )}

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
              setIsRepaying(false);
            }}
          >
            borrow
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsRepaying(true);
            }}
          >
            repay
          </Tab>
        </TabList>
        {BorrowTab()}
        {/* New Tab ================================== */}
        {RepayTab()}
      </Tabs>
    </SupplyBorrowContainer>
  );
};
export default BorrowModal;

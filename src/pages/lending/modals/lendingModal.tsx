import styled from "@emotion/styled";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import useModalStore from "../stores/useModals";
import { Text } from "global/packages/src";
import { ReactNode, useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { ModalWallet } from "../components/Styled";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import LendingField from "../components/lendingField";
import { CantoTransactionType } from "global/config/transactionTypes";
import { Details } from "../components/BorrowLimits";
import { maxBorrowInUnderlying } from "../utils/borrowRepayLimits";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { userMaximumWithdrawal } from "../utils/supplyWithdrawLimits";

interface IProps {
  onClose: () => void;
  position: UserLMPosition;
  modalType: "supply_withdraw" | "repay_borrow";
}

type ActionType = "withdraw" | "repay" | "borrow" | "supply";
const LendingModal = ({ position, onClose, modalType }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [actionType, setActionType] = useState<ActionType>("supply");
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isMax, setMax] = useState(false);
  //!need to revisit this condition
  const [inputState, setInputState] = useState(
    !token.allowance ? InputState.ENABLE : InputState.ENTERAMOUNT
  );

  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    resetInput();
  }, [actionType]);

  function resetInput() {
    //if in repay or supply tab and allowance is true or if borrowing is true
    if (
      (actionType == "repay" || actionType == "supply") &&
      token.allowance.isZero()
    ) {
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
      } else if (value.length == 0 || Number(value) <= 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
      } else if (
        parseUnits(value, token.data.underlying.decimals).gt(token.allowance) &&
        (actionType == "repay" || actionType == "withdraw")
      ) {
        //need more allowance
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

  function WalletForRepayAndSupply() {
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

  function WalletForWithdraw() {
    return (
      <ModalWallet>
        <p>currently supplying</p>
        <p>
          {truncateNumber(
            formatUnits(token.supplyBalance, token.data.underlying.decimals)
          )}{" "}
          {token.data.underlying.symbol}
        </p>
      </ModalWallet>
    );
  }

  const SupplyTab = () => {
    return (
      <TabPanel>
        <LendingField
          token={token}
          value={userAmount}
          transactionType={CantoTransactionType.SUPPLY}
          canDoMax={true}
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setUserAmount(
                formatUnits(token.balanceOf, token.data.underlying.decimals)
              );
              setMax(true);
              setInputState(InputState.CONFIRM);
            }
            //have to call this to check allowance
            inputValidation(
              formatUnits(token.balanceOf, token.data.underlying.decimals),
              token.balanceOf
            );
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
        <Details
          transactionType={CantoTransactionType.SUPPLY}
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
            inputState == InputState.ENABLE ||
            inputState == InputState.INCREASE_ALLOWANCE
              ? CantoTransactionType.ENABLE
              : CantoTransactionType.SUPPLY
          }
          state={inputState}
          max={isMax}
          token={token}
          isEth={token.data.symbol == "cCANTO"}
          amount={userAmount}
        />

        {/* {WalletForSupply()} */}
      </TabPanel>
    );
  };

  const WithdrawTab = () => {
    const [limit80Percent, totalLimit, isMax] = userMaximumWithdrawal(
      token.supplyBalance,
      position.totalBorrow,
      position.totalBorrowLimit,
      token.collateralFactor,
      token.price,
      token.collateral
    );
    return (
      <TabPanel>
        <LendingField
          token={token}
          value={userAmount}
          transactionType={CantoTransactionType.WITHDRAW}
          canDoMax={isMax}
          onMax={() => {
            if (inputState != InputState.ENABLE) {
              setUserAmount(
                formatUnits(limit80Percent, token.data.underlying.decimals)
              );
              setMax(isMax);
              if (limit80Percent.isZero()) {
                setInputState(InputState.ENTERAMOUNT);
              } else {
                setInputState(InputState.CONFIRM);
              }
            }
            //don't need to call validation since no allowance needed
          }}
          onChange={(value) => {
            setUserAmount(value);
            inputValidation(value, totalLimit);
            setMax(false);
          }}
          balance={truncateNumber(
            formatUnits(token.supplyBalance, token.data.underlying.decimals)
          )}
        />
        <Details
          transactionType={CantoTransactionType.WITHDRAW}
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
          transactionType={CantoTransactionType.WITHDRAW}
        />

        {/* {WalletForWithdraw()} */}
      </TabPanel>
    );
  };

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

        {/* {WalletForBorrow()} */}
      </TabPanel>
    );
  };
  const RepayTab = () => {
    const repayLimit = token.balanceOf.lt(token.borrowBalance)
      ? token.balanceOf
      : token.borrowBalance;
    return (
      <TabPanel>
        <LendingField
          token={token}
          value={userAmount}
          transactionType={CantoTransactionType.REPAY}
          canDoMax={true}
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

        {/* {WalletForRepay()}   */}
      </TabPanel>
    );
  };

  function getTransactionFromActionType(
    value: ActionType
  ): CantoTransactionType {
    switch (value) {
      case "repay":
        return CantoTransactionType.REPAY;
      case "borrow":
        return CantoTransactionType.BORROW;
      case "supply":
        return CantoTransactionType.SUPPLY;
      case "withdraw":
        return CantoTransactionType.WITHDRAW;
      default:
        return CantoTransactionType.WITHDRAW;
    }
  }
  return (
    <Styled>
      {transaction?.status != "None" && transaction?.status && (
        <GlobalLoadingModal
          transactionType={
            inputState == InputState.ENABLE
              ? CantoTransactionType.ENABLE
              : inputState == InputState.INCREASE_ALLOWANCE
              ? CantoTransactionType.INCREASE_ALLOWANCE
              : getTransactionFromActionType(actionType)
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
            width: "30px",
            height: "30px",
          }}
          src={token.data.underlying.icon}
          alt={token.data.underlying.name}
        />
        <Text type="title" size="title2">
          {token.data.underlying.name}
        </Text>
      </div>
      {modalType == "supply_withdraw" &&
        getTabs(
          {
            name: "Supply",
            child: SupplyTab(),
            onClick() {
              setActionType("supply");
            },
          },
          {
            name: "Withdraw",
            child: WithdrawTab(),
            onClick() {
              setActionType("withdraw");
            },
          }
        )}

      {modalType == "repay_borrow" &&
        getTabs(
          {
            name: "Borrow",
            child: BorrowTab(),
            onClick() {
              setActionType("borrow");
            },
          },
          {
            name: "Repay",
            child: RepayTab(),
            onClick() {
              setActionType("repay");
            },
          }
        )}
    </Styled>
  );

  interface ITabs {
    name: string;
    onClick: () => void;
    child: ReactNode;
  }
  function getTabs(tab1: ITabs, tab2: ITabs) {
    return (
      <Tabs
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}
      >
        <TabList className={"tablist"}>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={tab1.onClick}
          >
            <Text type="title">{tab1.name}</Text>
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={tab2.onClick}
          >
            <Text type="title">{tab2.name}</Text>
          </Tab>
        </TabList>
        {tab1.child}

        {tab2.child}
      </Tabs>
    );
  }
};

const Styled = styled.div`
  display: flex;
  width: 30rem;
  flex-direction: column;
  position: relative;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
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
      padding: 20px 0;
      &:hover:not(.selected) {
        background: #a7efd218;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .react-tabs__tab-panel {
    margin: 1rem 0;
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
export default LendingModal;

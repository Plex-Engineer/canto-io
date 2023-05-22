import styled from "@emotion/styled";
import {
  LendingTransaction,
  UserLMPosition,
  UserLMTokenDetails,
} from "../config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import { ReactNode, useState } from "react";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { maxBorrowInUnderlying } from "../utils/borrowRepayLimits";
import { userMaximumWithdrawal } from "../utils/supplyWithdrawLimits";
import AmountField from "../components/amountField";
import { getButtonText } from "../utils/modalButtonParams";
import {
  convertStringToBigNumber,
  truncateNumber,
} from "global/utils/formattingNumbers";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { Details } from "../components/BorrowLimits";
import { lendingMarketTx } from "../utils/transactions";
import { TransactionStore } from "global/stores/transactionStore";

interface IProps {
  onClose: () => void;
  position: UserLMPosition;
  modalType: "supply_withdraw" | "repay_borrow";

  activeToken: UserLMTokenDetails;
  chainId: number;
  txStore: TransactionStore;
}

type ActionType = "withdraw" | "repay" | "borrow" | "supply";
const LendingModal = ({
  position,
  onClose,
  modalType,
  activeToken,
  chainId,
  txStore,
}: IProps) => {
  const [actionType, setActionType] = useState<ActionType>("supply");
  const [userAmount, setUserAmount] = useState("");

  const SupplyTab = () => {
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(
        userAmount,
        activeToken.data.underlying.decimals
      ),
      activeToken.balanceOf,
      CantoTransactionType.SUPPLY
    );
    return (
      <TabPanel>
        <Details
          transactionType={CantoTransactionType.SUPPLY}
          stringAmount={truncateNumber(
            userAmount,
            activeToken.data.underlying.decimals
          )}
          token={activeToken}
          icon={activeToken.data.underlying.icon}
          isBorrowing={false}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
        />
        <AmountField
          token={activeToken}
          value={userAmount}
          canDoMax={true}
          onMax={() =>
            setUserAmount(
              formatUnits(
                activeToken.balanceOf,
                activeToken.data.underlying.decimals
              )
            )
          }
          onChange={(value) => {
            setUserAmount(value);
          }}
          balance={truncateNumber(
            formatUnits(
              activeToken.balanceOf,
              activeToken.data.underlying.decimals
            )
          )}
        />
        <div
          style={{
            marginTop: "16px",
          }}
        >
          <PrimaryButton
            height="big"
            filled
            weight="bold"
            disabled={disabled}
            onClick={() => {
              lendingMarketTx(
                chainId,
                txStore,
                LendingTransaction.SUPPLY,
                activeToken,
                convertStringToBigNumber(
                  userAmount,
                  activeToken.data.underlying.decimals
                )
              );
            }}
          >
            {buttonText}
          </PrimaryButton>
        </div>
      </TabPanel>
    );
  };

  const WithdrawTab = () => {
    const [limit80Percent, totalLimit, isMax] = userMaximumWithdrawal(
      activeToken.supplyBalance,
      position.totalBorrow,
      position.totalBorrowLimit,
      activeToken.collateralFactor,
      activeToken.price,
      activeToken.collateral
    );
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(
        userAmount,
        activeToken.data.underlying.decimals
      ),
      totalLimit,
      CantoTransactionType.WITHDRAW
    );
    return (
      <TabPanel>
        <Details
          transactionType={CantoTransactionType.WITHDRAW}
          icon={activeToken.data.underlying.icon}
          token={activeToken}
          stringAmount={truncateNumber(
            userAmount,
            activeToken.data.underlying.decimals
          )}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
          isBorrowing={false}
        />
        <AmountField
          token={activeToken}
          value={userAmount}
          canDoMax={isMax}
          onMax={() =>
            setUserAmount(
              formatUnits(limit80Percent, activeToken.data.underlying.decimals)
            )
          }
          onChange={(value) => setUserAmount(value)}
          balance={truncateNumber(
            formatUnits(
              activeToken.supplyBalance,
              activeToken.data.underlying.decimals
            )
          )}
        />
        <div
          style={{
            marginTop: "16px",
          }}
        >
          <PrimaryButton
            height="big"
            filled
            weight="bold"
            disabled={disabled}
            onClick={() =>
              lendingMarketTx(
                chainId,
                txStore,
                LendingTransaction.WITHDRAW,
                activeToken,
                convertStringToBigNumber(
                  userAmount,
                  activeToken.data.underlying.decimals
                )
              )
            }
          >
            {buttonText}
          </PrimaryButton>
        </div>
      </TabPanel>
    );
  };

  const BorrowTab = () => {
    const borrowLimit80 = maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      80,
      activeToken.price
    );
    const borrowLimit100 = maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      100,
      activeToken.price
    );
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(
        userAmount,
        activeToken.data.underlying.decimals
      ),
      borrowLimit100,
      CantoTransactionType.BORROW
    );
    return (
      <TabPanel>
        <Details
          transactionType={CantoTransactionType.BORROW}
          stringAmount={truncateNumber(
            userAmount,
            activeToken.data.underlying.decimals
          )}
          token={activeToken}
          icon={activeToken.data.underlying.icon}
          isBorrowing={true}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
        />
        <AmountField
          token={activeToken}
          value={userAmount}
          canDoMax={false}
          onMax={() => {
            if (borrowLimit80.lte(0)) {
              setUserAmount("0");
            } else {
              setUserAmount(
                formatUnits(borrowLimit80, activeToken.data.underlying.decimals)
              );
            }
          }}
          onChange={(value) => setUserAmount(value)}
          balance={truncateNumber(
            formatUnits(
              activeToken.borrowBalance,
              activeToken.data.underlying.decimals
            )
          )}
        />
        <PrimaryButton
          height="big"
          filled
          weight="bold"
          disabled={disabled}
          onClick={() =>
            lendingMarketTx(
              chainId,
              txStore,
              LendingTransaction.BORROW,
              activeToken,
              convertStringToBigNumber(
                userAmount,
                activeToken.data.underlying.decimals
              )
            )
          }
        >
          {" "}
          {buttonText}
        </PrimaryButton>
      </TabPanel>
    );
  };
  const RepayTab = () => {
    const repayLimit = activeToken.balanceOf.lt(activeToken.borrowBalance)
      ? activeToken.balanceOf
      : activeToken.borrowBalance;
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(
        userAmount,
        activeToken.data.underlying.decimals
      ),
      repayLimit,
      CantoTransactionType.REPAY
    );
    const [repayMax, setRepayMax] = useState(false);
    return (
      <TabPanel>
        <Details
          transactionType={CantoTransactionType.REPAY}
          stringAmount={truncateNumber(
            userAmount,
            activeToken.data.underlying.decimals
          )}
          icon={activeToken.data.underlying.icon}
          token={activeToken}
          isBorrowing={true}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
        />
        <AmountField
          token={activeToken}
          value={userAmount}
          canDoMax={true}
          onMax={() => {
            setUserAmount(
              formatUnits(repayLimit, activeToken.data.underlying.decimals)
            );
            setRepayMax(true);
          }}
          onChange={(value) => {
            setUserAmount(value);
            setRepayMax(false);
          }}
          balance={truncateNumber(
            formatUnits(
              activeToken.borrowBalance,
              activeToken.data.underlying.decimals
            )
          )}
        />
        <PrimaryButton
          height="big"
          filled
          weight="bold"
          disabled={disabled}
          onClick={() =>
            lendingMarketTx(
              chainId,
              txStore,
              LendingTransaction.REPAY,
              activeToken,
              repayMax &&
                activeToken.balanceOf.gt(activeToken.borrowBalance.add(1000))
                ? BigNumber.from(
                    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                  )
                : convertStringToBigNumber(
                    userAmount,
                    activeToken.data.underlying.decimals
                  )
            )
          }
        >
          {" "}
          {buttonText}
        </PrimaryButton>
      </TabPanel>
    );
  };

  return (
    <Styled>
      <div className="title">
        <img
          style={{
            width: "30px",
            height: "30px",
          }}
          src={activeToken.data.underlying.icon}
          alt={activeToken.data.underlying.name}
        />
        <Text type="title" size="title2">
          {activeToken.data.underlying.name}
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
  .react-tabs {
    background-color: red;
    display: flex;
  }
  .react-tabs__tab-panel {
    display: flex;
    flex-direction: column;
  }
  .amount-field {
    margin-top: 0rem;
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

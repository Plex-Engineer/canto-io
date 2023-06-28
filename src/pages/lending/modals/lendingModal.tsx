import styled from "@emotion/styled";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
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

const LendingModal = ({
  position,
  modalType,
  activeToken,
  chainId,
  txStore,
}: IProps) => {
  interface LendingTabProps {
    txType: CantoTransactionType;
    balance: BigNumber;
    max: BigNumber;
    canDoMax: boolean;
    limit80Percent?: BigNumber;
  }
  const LendingTab = ({
    txType,
    balance,
    max,
    canDoMax,
    limit80Percent,
  }: LendingTabProps) => {
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(
        userAmount,
        activeToken.data.underlying.decimals
      ),
      max,
      txType
    );
    const [maxClicked, setMaxClicked] = useState(false);
    return (
      <TabPanel>
        <Details
          transactionType={txType}
          stringAmount={truncateNumber(
            userAmount,
            activeToken.data.underlying.decimals
          )}
          icon={activeToken.data.underlying.icon}
          token={activeToken}
          isBorrowing={modalType === "repay_borrow"}
          borrowLimit={position.totalBorrowLimit}
          borrowBalance={position.totalBorrow}
          userBalanceType={
            modalType === "repay_borrow"
              ? "currently borrowing"
              : txType === CantoTransactionType.SUPPLY
              ? "balance"
              : "supply balance"
          }
          userBalance={
            truncateNumber(
              formatUnits(balance, activeToken.data.underlying.decimals)
            ) +
            " " +
            activeToken.data.underlying.symbol
          }
        />
        <AmountField
          token={activeToken}
          value={userAmount}
          canDoMax={canDoMax}
          onMax={() => {
            setUserAmount(
              formatUnits(
                limit80Percent
                  ? limit80Percent.lte(0)
                    ? "0"
                    : limit80Percent
                  : max,
                activeToken.data.underlying.decimals
              )
            );
            setMaxClicked(true);
          }}
          onChange={(value) => {
            setUserAmount(value);
            setMaxClicked(false);
          }}
          balance={truncateNumber(
            formatUnits(balance, activeToken.data.underlying.decimals)
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
                txType,
                activeToken,
                maxClicked &&
                  txType === CantoTransactionType.REPAY &&
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
        </div>
      </TabPanel>
    );
  };

  const [userAmount, setUserAmount] = useState("");

  //limits
  const [limit80Percent, totalLimit, isMax] = userMaximumWithdrawal(
    activeToken.supplyBalance,
    position.totalBorrow,
    position.totalBorrowLimit,
    activeToken.collateralFactor,
    activeToken.price,
    activeToken.collateral
  );
  const borrowLimit80 = () =>
    maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      80,
      activeToken.price
    );
  const borrowLimit100 = () =>
    maxBorrowInUnderlying(
      position.totalBorrow,
      position.totalBorrowLimit,
      100,
      activeToken.price
    );
  const repayLimit = () =>
    activeToken.balanceOf.lt(activeToken.borrowBalance)
      ? activeToken.balanceOf
      : activeToken.borrowBalance;

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
            child: LendingTab({
              txType: CantoTransactionType.SUPPLY,
              balance: activeToken.balanceOf,
              max: activeToken.balanceOf,
              canDoMax: true,
            }),
          },
          {
            name: "Withdraw",
            child: LendingTab({
              txType: CantoTransactionType.WITHDRAW,
              balance: activeToken.supplyBalance,
              max: totalLimit,
              canDoMax: isMax,
              limit80Percent: limit80Percent,
            }),
          }
        )}

      {modalType == "repay_borrow" &&
        getTabs(
          {
            name: "Borrow",
            child: LendingTab({
              txType: CantoTransactionType.BORROW,
              balance: activeToken.borrowBalance,
              max: borrowLimit100(),
              canDoMax: false,
              limit80Percent: borrowLimit80(),
            }),
          },
          {
            name: "Repay",
            child: LendingTab({
              txType: CantoTransactionType.REPAY,
              balance: activeToken.borrowBalance,
              max: repayLimit(),
              canDoMax: true,
            }),
          }
        )}
    </Styled>
  );

  interface ITabs {
    name: string;
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
          <Tab className={"tab"} selectedClassName="tab-selected">
            <Text type="title">{tab1.name}</Text>
          </Tab>
          <Tab className={"tab"} selectedClassName="tab-selected">
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

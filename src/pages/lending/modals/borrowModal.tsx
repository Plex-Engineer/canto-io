import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { truncateNumber } from "global/utils/formattingNumbers";
import LendingField from "../components/lendingField";
import { Details } from "../components/BorrowLimits";
import {
  LendingTransaction,
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { maxBorrowInUnderlying } from "pages/lending/utils/borrowRepayLimits";
import { SupplyBorrowContainer } from "../components/Styled";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import { TransactionStore } from "global/stores/transactionStore";
import { lendingMarketTx } from "../utils/transactions";
import { convertStringToBigNumber } from "global/utils/formattingNumbers";
import { getButtonText } from "../utils/modalButtonParams";
import { BigNumber } from "ethers";
interface IProps {
  position: UserLMPosition;
  activeToken: UserLMTokenDetails;
  chainId: number;
  txStore: TransactionStore;
}
const BorrowModal = ({ position, chainId, txStore, activeToken }: IProps) => {
  const [userAmount, setUserAmount] = useState("");

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
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        {/* borrow */}
        <LendingField
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
        {/* 1st tab */}
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
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        <LendingField
          token={activeToken}
          value={userAmount}
          canDoMax={true}
          //repay
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
        {/* 2nd tab */}
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
    <SupplyBorrowContainer>
      <div className="title">
        <img
          style={{
            width: "26px",
            height: "26px",
          }}
          src={activeToken.data.underlying.icon}
          alt={activeToken.data.underlying.name}
        />
        <p
          style={{
            fontWeight: "300",
            fontSize: "18px",
            letterSpacing: "-0.03em",
            color: "white",
          }}
        >
          {activeToken.data.underlying.name}
        </p>
      </div>
      <Tabs
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}
      >
        <TabList className={"tablist"}>
          <Tab className={"tab"} selectedClassName="tab-selected">
            <Text type="title">borrow</Text>
          </Tab>
          <Tab className={"tab"} selectedClassName="tab-selected">
            <Text type="title">Repay</Text>
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

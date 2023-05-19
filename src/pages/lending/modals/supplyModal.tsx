import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LendingField from "../components/lendingField";
import { useState } from "react";
import { Details } from "../components/BorrowLimits";
import { truncateNumber } from "global/utils/formattingNumbers";
import {
  LendingTransaction,
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { userMaximumWithdrawal } from "pages/lending/utils/supplyWithdrawLimits";
import { SupplyBorrowContainer } from "../components/Styled";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import { lendingMarketTx } from "../utils/transactions";
import { TransactionStore } from "global/stores/transactionStore";
import { convertStringToBigNumber } from "global/utils/formattingNumbers";
import { getButtonText } from "../utils/modalButtonParams";
interface IProps {
  position: UserLMPosition;
  activeToken: UserLMTokenDetails;
  chainId: number;
  txStore: TransactionStore;
}

const SupplyModal = ({ position, chainId, txStore, activeToken }: IProps) => {
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
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        {/* supply */}
        <LendingField
          token={activeToken}
          value={userAmount}
          canDoMax={true}
          onMax={() => {
            setUserAmount(
              formatUnits(
                activeToken.data.underlying.symbol === "CANTO"
                  ? activeToken.balanceOf.sub(parseUnits("1", 17))
                  : activeToken.balanceOf,
                activeToken.data.underlying.decimals
              )
            );
          }}
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
        {/* 1st tab */}
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
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
          }}
        />
        <LendingField
          token={activeToken}
          value={userAmount}
          canDoMax={isMax}
          //Withdraw
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
        {/* 2nd tab */}
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
  return (
    <SupplyBorrowContainer
      onScroll={(e) => {
        e.preventDefault();
      }}
    >
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
      <Tabs
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}
      >
        <TabList className={"tablist"}>
          <Tab className={"tab"} selectedClassName="tab-selected">
            <Text type="title">Supply</Text>
          </Tab>
          <Tab className={"tab"} selectedClassName="tab-selected">
            <Text type="title">withdraw</Text>
          </Tab>
        </TabList>
        {SupplyTab()}

        {WithdrawTab()}
      </Tabs>
    </SupplyBorrowContainer>
  );
};
export default SupplyModal;

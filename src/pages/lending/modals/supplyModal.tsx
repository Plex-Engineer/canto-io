import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LendingField from "../components/lendingField";
import { useState } from "react";
import { Details } from "../components/BorrowLimits";
import { truncateNumber } from "global/utils/formattingNumbers";
import useModalStore from "pages/lending/stores/useModals";
import {
  LendingTransaction,
  UserLMPosition,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { userMaximumWithdrawal } from "pages/lending/utils/supplyWithdrawLimits";
import { SupplyBorrowContainer } from "../components/Styled";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import { lendingMarketTx } from "../utils/transactions";
import { useTransactionStore } from "global/stores/transactionStore";
import { useNetworkInfo } from "global/stores/networkInfo";
import { convertStringToBigNumber } from "global/utils/formattingNumbers";
import { getButtonText } from "../utils/modalButtonParams";
interface IProps {
  position: UserLMPosition;
}

const SupplyModal = ({ position }: IProps) => {
  const txStore = useTransactionStore();
  const networkInfo = useNetworkInfo();

  const token = useModalStore().activeToken;
  const [userAmount, setUserAmount] = useState("");

  const SupplyTab = () => {
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(userAmount, token.data.underlying.decimals),
      token.balanceOf,
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
          token={token}
          value={userAmount}
          canDoMax={true}
          onMax={() => {
            setUserAmount(
              formatUnits(
                token.data.underlying.symbol === "CANTO"
                  ? token.balanceOf.sub(parseUnits("1", 17))
                  : token.balanceOf,
                token.data.underlying.decimals
              )
            );
          }}
          onChange={(value) => {
            setUserAmount(value);
          }}
          balance={truncateNumber(
            formatUnits(token.balanceOf, token.data.underlying.decimals)
          )}
        />
        {/* 1st tab */}
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
                Number(networkInfo.chainId),
                txStore,
                LendingTransaction.SUPPLY,
                token,
                convertStringToBigNumber(
                  userAmount,
                  token.data.underlying.decimals
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
      token.supplyBalance,
      position.totalBorrow,
      position.totalBorrowLimit,
      token.collateralFactor,
      token.price,
      token.collateral
    );
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(userAmount, token.data.underlying.decimals),
      totalLimit,
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
        <LendingField
          token={token}
          value={userAmount}
          canDoMax={isMax}
          //Withdraw
          onMax={() =>
            setUserAmount(
              formatUnits(limit80Percent, token.data.underlying.decimals)
            )
          }
          onChange={(value) => setUserAmount(value)}
          balance={truncateNumber(
            formatUnits(token.supplyBalance, token.data.underlying.decimals)
          )}
        />
        {/* 2nd tab */}
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
                Number(networkInfo.chainId),
                txStore,
                LendingTransaction.WITHDRAW,
                token,
                convertStringToBigNumber(
                  userAmount,
                  token.data.underlying.decimals
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
          src={token.data.underlying.icon}
          alt={token.data.underlying.name}
        />
        <Text type="title" size="title2">
          {token.data.underlying.name}
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

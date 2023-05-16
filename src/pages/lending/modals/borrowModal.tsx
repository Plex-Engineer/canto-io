import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { truncateNumber } from "global/utils/utils";
import LendingField from "../components/lendingField";
import { Details } from "../components/BorrowLimits";
import useModalStore from "pages/lending/stores/useModals";
import {
  LendingTransaction,
  UserLMPosition,
} from "pages/lending/config/interfaces";
import { formatUnits } from "ethers/lib/utils";
import { maxBorrowInUnderlying } from "pages/lending/utils/borrowRepayLimits";
import { SupplyBorrowContainer } from "../components/Styled";
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import { useTransactionStore } from "global/stores/transactionStore";
import { useNetworkInfo } from "global/stores/networkInfo";
import { lendingMarketTx } from "../utils/transactions";
import { convertStringToBigNumber } from "pages/bridging/utils/utils";
import { getButtonText } from "../utils/modalButtonParams";
import LoadingModalv3 from "global/components/modals/loadingv3";
import { BigNumber } from "ethers";
interface IProps {
  onClose: () => void;
  position: UserLMPosition;
}
const BorrowModal = ({ position, onClose }: IProps) => {
  const txStore = useTransactionStore();
  const networkInfo = useNetworkInfo();

  const token = useModalStore().activeToken;
  const [userAmount, setUserAmount] = useState("");

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
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(userAmount, token.data.underlying.decimals),
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
          token={token}
          value={userAmount}
          canDoMax={false}
          onMax={() => {
            if (borrowLimit80.lte(0)) {
              setUserAmount("0");
            } else {
              setUserAmount(
                formatUnits(borrowLimit80, token.data.underlying.decimals)
              );
            }
          }}
          onChange={(value) => setUserAmount(value)}
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
        <PrimaryButton
          height="big"
          filled
          weight="bold"
          disabled={disabled}
          onClick={() =>
            lendingMarketTx(
              networkInfo,
              txStore,
              LendingTransaction.BORROW,
              token,
              convertStringToBigNumber(
                userAmount,
                token.data.underlying.decimals
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
    const repayLimit = token.balanceOf.lt(token.borrowBalance)
      ? token.balanceOf
      : token.borrowBalance;
    const [buttonText, disabled] = getButtonText(
      convertStringToBigNumber(userAmount, token.data.underlying.decimals),
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
          token={token}
          value={userAmount}
          canDoMax={true}
          //repay
          onMax={() => {
            setUserAmount(
              formatUnits(repayLimit, token.data.underlying.decimals)
            );
            setRepayMax(true);
          }}
          onChange={(value) => {
            setUserAmount(value);
            setRepayMax(false);
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
        <PrimaryButton
          height="big"
          filled
          weight="bold"
          disabled={disabled}
          onClick={() =>
            lendingMarketTx(
              networkInfo,
              txStore,
              LendingTransaction.REPAY,
              token,
              repayMax && token.balanceOf.gt(token.borrowBalance.add(1000))
                ? BigNumber.from(
                    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                  )
                : convertStringToBigNumber(
                    userAmount,
                    token.data.underlying.decimals
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
      <LoadingModalv3 onClose={onClose} />
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

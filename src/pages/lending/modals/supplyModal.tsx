import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LendingField from "../components/lendingField";
import { useState, useEffect } from "react";
import { Details } from "../components/BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { userMaximumWithdrawal } from "pages/lending/utils/supplyWithdrawLimits";
import { SupplyBorrowContainer, ModalWallet } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import { Text } from "global/packages/src";
interface IProps {
  position: UserLMPosition;
  onClose: () => void;
}

const SupplyModal = ({ position, onClose }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isMax, setMax] = useState(false);
  const [inputState, setInputState] = useState(
    !token.allowance ? InputState.ENABLE : InputState.ENTERAMOUNT
  );

  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    resetInput();
  }, [isWithdrawing]);

  function resetInput() {
    //if in supply tab and allowance is true or if withdraw is true
    if (token.allowance.isZero() && !isWithdrawing) {
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
      } else if (value.length < 1 || Number(value) <= 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
      } else if (
        parseUnits(value, token.data.underlying.decimals).gt(token.allowance) &&
        !isWithdrawing
      ) {
        //need more allowance
        setInputState(InputState.INCREASE_ALLOWANCE);
      } else {
        setInputState(InputState.CONFIRM);
      }
    }
  }

  function WalletForSupply() {
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
        <div
          style={{
            display: "flex",
            marginTop: "1rem",
          }}
        />
        {/* supply */}
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
        <div
          style={{
            display: "flex",
            marginTop: "1rem",
          }}
        />
        <LendingField
          token={token}
          value={userAmount}
          transactionType={CantoTransactionType.WITHDRAW}
          canDoMax={isMax}
          //Withdraw
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

  return (
    <SupplyBorrowContainer
      onScroll={(e) => {
        e.preventDefault();
      }}
    >
      {transaction?.status != "None" && transaction?.status && (
        <GlobalLoadingModal
          transactionType={
            inputState == InputState.ENABLE
              ? CantoTransactionType.ENABLE
              : inputState == InputState.INCREASE_ALLOWANCE
              ? CantoTransactionType.INCREASE_ALLOWANCE
              : isWithdrawing
              ? CantoTransactionType.WITHDRAW
              : CantoTransactionType.SUPPLY
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
              setIsWithdrawing(false);
            }}
          >
            <Text type="title">Supply</Text>
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsWithdrawing(true);
            }}
          >
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

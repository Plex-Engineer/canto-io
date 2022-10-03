import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LendingField from "../components/lendingField";
import { useState, useEffect } from "react";
import { Details, TrasanctionType } from "../components/BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import LoadingModal from "./loadingModal";
import { truncateNumber } from "global/utils/utils";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { userMaximumWithdrawal } from "pages/lending/utils/supplyWithdrawLimits";
import {
  SupplyBorrowContainer,
  ModalWallet,
  SupplyBorrowLoadingOverlay,
} from "../components/Styled";
interface IProps {
  position: UserLMPosition;
  onClose: () => void;
}

const SupplyModal = ({ onClose, position }: IProps) => {
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
            marginTop: "2rem",
          }}
        />
        <LendingField
          token={token}
          value={userAmount}
          transactionType={TrasanctionType.WITHDRAW}
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
    <SupplyBorrowContainer
      onScroll={(e) => {
        e.preventDefault();
      }}
    >
      {["PendingSignature", "Mining", "Success", "Fail", "Exception"].includes(
        transaction?.status ?? "none"
      ) ? (
        <SupplyBorrowLoadingOverlay>
          <LoadingModal
            isLoading
            modalText="borrowing bat"
            status={transaction?.status}
          />
        </SupplyBorrowLoadingOverlay>
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
    </SupplyBorrowContainer>
  );
};
export default SupplyModal;

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import { TransactionStatus } from "@usedapp/core";
import { InputState, ReactiveButton } from "../components/reactiveButton";
import { truncateNumber } from "global/utils/utils";
import LendingField from "../components/lendingField";
import { Details, TrasanctionType } from "../components/BorrowLimits";
import LoadingModal from "./loadingModal";
import useModalStore from "pages/lending/stores/useModals";
import {
  UserLMPosition,
  UserLMTokenDetails,
} from "pages/lending/config/interfaces";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { maxBorrowInUnderlying } from "pages/lending/utils/borrowRepayLimits";
import { BigNumber } from "ethers";
import {
  SupplyBorrowContainer,
  ModalWallet,
  SupplyBorrowLoadingOverlay,
} from "../components/Styled";
interface IProps {
  onClose: () => void;
  position: UserLMPosition;
}
const BorrowModal = ({ onClose, position }: IProps) => {
  const modalStore = useModalStore();
  const token: UserLMTokenDetails = modalStore.activeToken;
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const [isRepaying, setIsRepaying] = useState(true);
  const [isMax, setMax] = useState(false);

  const [inputState, setInputState] = useState(InputState.ENTERAMOUNT);

  const [userAmount, setUserAmount] = useState("");

  function resetInput() {
    //if in repay tab and allowance is true or if borrowing is true
    if ((isRepaying && token.allowance) || !isRepaying) {
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
      } else if (value.length < 1 || Number(value) == 0) {
        setInputState(InputState.ENTERAMOUNT);
      } else if (parseUnits(value, token.data.underlying.decimals).gt(max)) {
        setInputState(InputState.NOFUNDS);
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
          transactionType={TrasanctionType.BORROW}
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
          transactionType={TrasanctionType.BORROW}
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
          transactionType={TrasanctionType.BORROW}
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
          transactionType={TrasanctionType.REPAY}
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
          transactionType={TrasanctionType.REPAY}
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
            inputState != InputState.ENABLE
              ? TrasanctionType.REPAY
              : TrasanctionType.ENABLE
          }
        />

        {WalletForRepay()}
      </TabPanel>
    );
  };

  useEffect(() => {
    if (
      ["Success", "Fail", "Exception"].includes(transaction?.status ?? "none")
    ) {
      setTimeout(onClose, 1000);
    }
  }, [transaction?.status]);

  return (
    <SupplyBorrowContainer>
      {/* 'None' , 'PendingSignature' , 'Mining' , 'Success' , 'Fail' , 'Exception' */}
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
              setIsRepaying(true);
              resetInput();
            }}
          >
            borrow
          </Tab>
          <Tab
            className={"tab"}
            selectedClassName="tab-selected"
            onClick={() => {
              setIsRepaying(false);
              resetInput();
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

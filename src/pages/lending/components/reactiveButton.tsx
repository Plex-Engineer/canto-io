import { TransactionStatus } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import {
  useSupply,
  useBorrow,
  useReedem,
  useRepay,
  useEnableToken,
  useReedemToken,
  useSupplyEth,
  useRepayEth,
  Details,
} from "../hooks/useTransaction";
import { UserLMTokenDetails } from "../config/interfaces";
import { parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { PrimaryButton } from "global/packages/src";
import { getReactiveButtonText } from "../utils/modalButtonParams";
import { CantoTransactionType } from "global/config/transactionTypes";
//ENUM
enum InputState {
  ENABLE,
  NOFUNDS,
  ENTERAMOUNT,
  CONFIRM,
  INVALID,
  INCREASE_ALLOWANCE,
}
interface IButton {
  state: InputState;
  token: UserLMTokenDetails;
  amount: string;
  transactionType: CantoTransactionType;
  max: boolean;
  isEth: boolean;
  onTransaction: (transaction: TransactionStatus) => void;
}

const ReactiveButton = ({
  state,
  token,
  amount,
  transactionType,
  onTransaction,
  max,
  isEth,
}: IButton) => {
  const BNAmount =
    !amount || isNaN(Number(amount))
      ? BigNumber.from(0)
      : parseUnits(
          truncateNumber(amount, token.data.underlying.decimals),
          token.data.underlying.decimals
        );

  const details: Details = {
    name: token.data.underlying.symbol,
    address: token.data.address,
    icon: token.data.underlying.icon,
    amount: amount,
    type: transactionType,
  };
  const { state: supplyState, send: supplySend } = useSupply(details);
  const { sendTransaction: supplySendEth, state: supplyStateEth } =
    useSupplyEth(details);
  const { sendTransaction: repaySendEth, state: repayStateEth } =
    useRepayEth(details);
  const { state: borrowState, send: borrowSend } = useBorrow(details);
  const { state: repayState, send: repaySend } = useRepay(details);
  const { state: redeemState, send: redeemSend } = useReedem(details);

  const { state: enableState, send: enableSend } = useEnableToken({
    name: token.data.underlying.symbol,
    address: token.data.underlying.address,
    icon: token.data.underlying.icon,
    amount: amount,
    type: CantoTransactionType.ENABLE,
  });

  const transaction: TransactionStatus = initTransaction();

  onTransaction(transaction);

  function initTransaction() {
    switch (transactionType) {
      case CantoTransactionType.SUPPLY:
        if (isEth) return supplyStateEth;
        else return supplyState;
      case CantoTransactionType.BORROW:
        return borrowState;
      case CantoTransactionType.REPAY:
        if (isEth) return repayStateEth;
        else return repayState;
      case CantoTransactionType.WITHDRAW:
        return redeemState;
      case CantoTransactionType.ENABLE:
        return enableState;
      default:
        return enableState;
    }
  }
  const [buttonText, disabled] = getReactiveButtonText(
    state,
    transactionType,
    BNAmount,
    token.cash,
    token.borrowCap,
    token.data.underlying.symbol
  );
  return (
    <div
      style={{
        marginTop: "16px",
      }}
    >
      <PrimaryButton
        disabled={disabled}
        height="big"
        filled
        weight="bold"
        onClick={async () => {
          if (
            state == InputState.ENABLE ||
            state == InputState.INCREASE_ALLOWANCE
          ) {
            enableSend(
              token.data.address,
              BigNumber.from(ethers.constants.MaxUint256)
            );
          } else {
            switch (transactionType) {
              case CantoTransactionType.SUPPLY:
                if (isEth) {
                  const gas = max ? parseUnits("1", "17") : BigNumber.from(0);
                  supplySendEth({
                    to: token.data.address,
                    value: BNAmount.sub(gas),
                  });
                } else {
                  supplySend(BNAmount);
                }
                break;
              case CantoTransactionType.BORROW:
                borrowSend(BNAmount);
                break;
              case CantoTransactionType.REPAY:
                if (isEth) {
                  repaySendEth({
                    to: token.data.address,
                    data: "0x4e4d9fea",
                    value: BNAmount,
                  });
                } else {
                  repaySend(
                    max &&
                      Number(token.balanceOf) >
                        Number(token.borrowBalance) + 0.001
                      ? "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                      : BNAmount
                  );
                }
                break;
              case CantoTransactionType.WITHDRAW:
                redeemSend(BNAmount);
            }
          }
        }}
      >
        {buttonText}
      </PrimaryButton>
    </div>
  );
};

export { ReactiveButton, InputState };

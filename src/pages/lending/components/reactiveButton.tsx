import { TransactionType } from "./BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import { BigNumber } from "ethers";
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
import { Mixpanel } from "mixpanel";
import { UserLMTokenDetails } from "../config/interfaces";
import { parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { PrimaryButton } from "cantoui";
import { getReactiveButtonText, showText } from "../utils/modalButtonParams";
//ENUM
enum InputState {
  ENABLE,
  NOFUNDS,
  ENTERAMOUNT,
  CONFIRM,
  INVALID,
}
interface IButton {
  state: InputState;
  token: UserLMTokenDetails;
  amount: string;
  transactionType: TransactionType;
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
    type: showText(transactionType),
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
    type: showText(transactionType),
  });

  const transaction: TransactionStatus = initTransaction();

  onTransaction(transaction);

  function initTransaction() {
    switch (transactionType) {
      case TransactionType.SUPPLY:
        if (isEth) return supplyStateEth;
        else return supplyState;
      case TransactionType.BORROW:
        return borrowState;
      case TransactionType.REPAY:
        if (isEth) return repayStateEth;
        else return repayState;
      case TransactionType.WITHDRAW:
        return redeemState;
      case TransactionType.ENABLE:
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
    <div style={{ margin: "1rem", display: "flex", justifyContent: "center" }}>
      <PrimaryButton
        size="lg"
        disabled={disabled}
        onClick={async () => {
          if (state == InputState.ENABLE) {
            enableSend(
              token.data.address,
              BigNumber.from(
                "115792089237316195423570985008687907853269984665640564039457584007913129639935"
              )
            );
          } else {
            switch (transactionType) {
              case TransactionType.SUPPLY:
                if (isEth) {
                  const gas = max ? parseUnits("1", "17") : BigNumber.from(0);
                  supplySendEth({
                    to: token.data.address,
                    value: BNAmount.sub(gas),
                  });
                } else {
                  supplySend(BNAmount);
                }
                Mixpanel.events.lendingMarketActions.supply(
                  token.wallet ?? "" ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );

                break;
              case TransactionType.BORROW:
                borrowSend(BNAmount);
                Mixpanel.events.lendingMarketActions.borrow(
                  token.wallet ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );
                break;
              case TransactionType.REPAY:
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
                Mixpanel.events.lendingMarketActions.repay(
                  token.wallet ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );
                break;
              case TransactionType.WITHDRAW:
                redeemSend(BNAmount);
                Mixpanel.events.lendingMarketActions.withdraw(
                  token.wallet ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );
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

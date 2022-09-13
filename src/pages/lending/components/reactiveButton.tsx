import { TrasanctionType } from "./BorrowLimits";
import { TransactionStatus } from "@usedapp/core";
import styled from "styled-components";
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
import { Mixpanel } from "mixpanel";
import { UserLMTokenDetails } from "../config/interfaces";
import { parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
//ENUM
enum InputState {
  ENABLE,
  NOFUNDS,
  ENTERAMOUNT,
  CONFIRM,
  INVALID,
}

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 2rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

export const DisabledButton = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: #939393;
  padding: 0.2rem 2rem;
  border: 1px solid #939393;
  margin: 2rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
`;

interface IButton {
  state: InputState;
  token: UserLMTokenDetails;
  amount: string;
  transactionType: TrasanctionType;
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
    type: showText(),
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
    type: showText(),
  });

  const transaction: TransactionStatus = initTransaction();

  onTransaction(transaction);

  function initTransaction() {
    switch (transactionType) {
      case TrasanctionType.SUPPLY:
        if (isEth) return supplyStateEth;
        else return supplyState;
      case TrasanctionType.BORROW:
        return borrowState;
      case TrasanctionType.REPAY:
        if (isEth) return repayStateEth;
        else return repayState;
      case TrasanctionType.WITHDRAW:
        return redeemState;
      case TrasanctionType.ENABLE:
        return enableState;
    }
  }
  function showText() {
    switch (transactionType) {
      case TrasanctionType.SUPPLY:
        return "Supply";
      case TrasanctionType.BORROW:
        return "Borrow";
      case TrasanctionType.REPAY:
        return "Repay";
      case TrasanctionType.WITHDRAW:
        return "Withdraw";
      case TrasanctionType.ENABLE:
        return "Enable";
    }
  }

  switch (state) {
    case InputState.ENABLE:
      return (
        <Button
          onClick={() => {
            enableSend(
              token.data.address,
              BigNumber.from(
                "115792089237316195423570985008687907853269984665640564039457584007913129639935"
              )
            );
          }}
        >
          {" "}
          enable{" "}
        </Button>
      );
    case InputState.ENTERAMOUNT:
      return <DisabledButton> enter amount </DisabledButton>;
    case InputState.CONFIRM:
      if (
        (transactionType == TrasanctionType.BORROW ||
          transactionType == TrasanctionType.WITHDRAW) &&
        token.cash.lt(BNAmount)
      ) {
        return (
          <DisabledButton>
            no {token.data.underlying.symbol} left
          </DisabledButton>
        );
      }
      if (
        transactionType == TrasanctionType.BORROW &&
        token.borrowCap.lt(BNAmount)
      ) {
        return <DisabledButton>borrow cap has been reached</DisabledButton>;
      }
      return (
        <Button
          onClick={async () => {
            switch (transactionType) {
              case TrasanctionType.SUPPLY:
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
              case TrasanctionType.BORROW:
                borrowSend(BNAmount);
                Mixpanel.events.lendingMarketActions.borrow(
                  token.wallet ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );
                break;
              case TrasanctionType.REPAY:
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
              case TrasanctionType.WITHDRAW:
                redeemSend(BNAmount);
                Mixpanel.events.lendingMarketActions.withdraw(
                  token.wallet ?? "",
                  token.data.symbol,
                  BNAmount.toString(),
                  token.price.toString()
                );
            }
          }}
        >
          {" "}
          <div>
            {/* {transaction?.status} */}
            {showText()}
          </div>{" "}
        </Button>
      );
    case InputState.NOFUNDS:
      return <DisabledButton> no funds </DisabledButton>;
    case InputState.INVALID:
      return <DisabledButton> enter valid value</DisabledButton>;
    default:
      return <Button> enable </Button>;
  }
};

export { ReactiveButton, InputState };

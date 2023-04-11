import styled from "@emotion/styled";
import CANTO from "assets/icons/canto.png";
import {
  convertBigNumberRatioIntoPercentage,
  noteSymbol,
  truncateNumber,
} from "global/utils/utils";
import { BigNumber } from "ethers";
import { UserLMTokenDetails } from "../config/interfaces";
import {
  expectedBorrowLimitUsedInSupplyOrWithdraw,
  newBorrowLimit,
} from "../utils/supplyWithdrawLimits";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  expectedBorrowLimitUsedInBorrowOrRepay,
  newBorrowAmount,
} from "../utils/borrowRepayLimits";
import React from "react";
import { CantoTransactionType } from "global/config/transactionTypes";
import { Text } from "global/packages/src";

interface Props {
  borrowLimit: BigNumber;
  icon: string;
  stringAmount: string;
  token: UserLMTokenDetails;
  isBorrowing: boolean;
  transactionType: CantoTransactionType;
  borrowBalance: BigNumber;
}

const Limits = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #222;
  padding: 1rem 0;
  span {
    color: var(--primary-color);
  }
  color: #efefef;
`;

const Details = ({
  borrowLimit,
  icon,
  stringAmount,
  token,
  isBorrowing,
  transactionType,
  borrowBalance,
}: Props) => {
  const amount =
    isNaN(Number(stringAmount)) || !stringAmount || Number(stringAmount) <= 0
      ? BigNumber.from(0)
      : parseUnits(stringAmount, token.data.underlying.decimals);

  const cBorrowLimit = formatUnits(
    isBorrowing ? borrowBalance : borrowLimit,
    18
  );

  const cBorrowLimitUsed = borrowLimit.isZero()
    ? 0
    : convertBigNumberRatioIntoPercentage(borrowBalance, borrowLimit) * 100;

  const cBorrowLimitHypo = formatUnits(
    isBorrowing
      ? newBorrowAmount(
          transactionType == CantoTransactionType.BORROW,
          amount,
          borrowBalance,
          token.price
        )
      : newBorrowLimit(
          transactionType == CantoTransactionType.SUPPLY,
          amount,
          token.collateralFactor,
          token.price,
          borrowLimit
        ),
    18
  );

  const cBorrowLimitUsedHypo = isBorrowing
    ? expectedBorrowLimitUsedInBorrowOrRepay(
        transactionType == CantoTransactionType.BORROW,
        amount,
        borrowBalance,
        token.price,
        borrowLimit
      ) * 100
    : expectedBorrowLimitUsedInSupplyOrWithdraw(
        transactionType == CantoTransactionType.SUPPLY,
        amount,
        token.collateralFactor,
        token.price,
        borrowLimit,
        borrowBalance
      ) * 100;

  return (
    <div>
      <Limits
        style={{
          marginTop: "0rem",
        }}
      >
        <div>
          <img
            src={icon}
            height={20}
            width={20}
            style={{
              marginBottom: "0.5rem",
            }}
          />
          <Text>
            {!isBorrowing ? "supply apr:" : "borrow rate:"}
            {!isBorrowing ? (
              <span>{token.supplyAPY.toFixed(2)}%</span>
            ) : (
              <span>{token.borrowAPY.toFixed(2)}%</span>
            )}
          </Text>
        </div>
        <div
          style={{
            textAlign: "right",
            visibility: isBorrowing ? "hidden" : "visible",
          }}
        >
          <img
            src={CANTO}
            height={20}
            width={20}
            style={{
              marginBottom: "0.5rem",
            }}
          />
          <p>
            dist apr <span>{token.distAPY.toFixed(2)}%</span>
          </p>
        </div>
      </Limits>
      <Limits>
        <p>collateral factor:</p>
        <p>{truncateNumber(formatUnits(token.collateralFactor.mul(100)))}%</p>
      </Limits>
      <Limits>
        <p>borrow {isBorrowing ? "balance" : "limit"}:</p>
        <p>
          {noteSymbol + truncateNumber(cBorrowLimit) + " "}
          {amount.gt(0) &&
          (token.collateral || isBorrowing) &&
          Number(cBorrowLimitHypo) > 0 ? (
            <React.Fragment>
              <span>-&gt;</span> {noteSymbol + truncateNumber(cBorrowLimitHypo)}
            </React.Fragment>
          ) : null}{" "}
        </p>
      </Limits>
      <Limits>
        <p>borrow limit used:</p>
        <p>
          {truncateNumber(cBorrowLimitUsed.toString()) + "% "}
          {amount.gt(0) &&
          (token.collateral || isBorrowing) &&
          cBorrowLimitUsedHypo > 0 ? (
            <React.Fragment>
              <span>-&gt;</span>{" "}
              {truncateNumber(cBorrowLimitUsedHypo.toString()) + "%"}
            </React.Fragment>
          ) : null}{" "}
        </p>
      </Limits>
      <LimitBar
        progress={!token.collateral ? cBorrowLimitUsed : cBorrowLimitUsedHypo}
      />
    </div>
  );
};

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: grey;

  .progress {
    background-color: var(--primary-color);
    height: 100%;
  }
`;
interface LimitBarProps {
  progress: number;
}
const LimitBar = ({ progress }: LimitBarProps) => {
  if (progress > 100) {
    progress = 100;
  }
  return (
    <ProgressBar>
      <div
        className="progress"
        style={{
          width: `${progress}%`,
          backgroundColor: `${
            progress > 60
              ? progress > 80
                ? "red"
                : "yellow"
              : "var(--primary-color)"
          }`,
        }}
      ></div>
    </ProgressBar>
  );
};

export { Details, LimitBar };

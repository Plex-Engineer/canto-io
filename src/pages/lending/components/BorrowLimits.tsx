import styled from "@emotion/styled";
import CANTO from "assets/icons/canto.png";
import {
  convertBigNumberRatioIntoPercentage,
  truncateNumber,
} from "global/utils/formattingNumbers";
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
import { CantoTransactionType } from "global/config/interfaces/transactionTypes";
import { Text } from "global/packages/src";
import { noteSymbol } from "global/config/tokenInfo";

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
  /* border-top: 1px solid #222; */
  padding: 12px 0;
  span {
    color: var(--primary-color);
  }
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
    <DetailStyled>
      <Limits>
        <div>
          <img src={icon} height={30} />
          <Text type="title">
            {!isBorrowing ? "supply apr:" : "borrow rate:"}
            {!isBorrowing ? (
              <>{token.supplyAPY.toFixed(2)}%</>
            ) : (
              <>{token.borrowAPY.toFixed(2)}%</>
            )}
          </Text>
        </div>
        <div
          style={{
            textAlign: "right",
            visibility: isBorrowing ? "hidden" : "visible",
          }}
        >
          <img src={CANTO} height={30} />
          <Text type="title">dist apr : {token.distAPY.toFixed(2)}%</Text>
        </div>
      </Limits>
      <Limits>
        <p>collateral factor:</p>
        <Text type="title">
          {truncateNumber(formatUnits(token.collateralFactor.mul(100)))}%
        </Text>
      </Limits>
      <Limits>
        <p>borrow {isBorrowing ? "balance" : "limit"}:</p>
        <Text type="title">
          {noteSymbol + truncateNumber(cBorrowLimit) + " "}
          {amount.gt(0) &&
          (token.collateral || isBorrowing) &&
          Number(cBorrowLimitHypo) > 0 ? (
            <React.Fragment>
              <span>-&gt;</span> {noteSymbol + truncateNumber(cBorrowLimitHypo)}
            </React.Fragment>
          ) : null}{" "}
        </Text>
      </Limits>
      <Limits>
        <p>borrow limit used:</p>
        <Text type="title">
          {truncateNumber(cBorrowLimitUsed.toString()) + "% "}
          {amount.gt(0) &&
          (token.collateral || isBorrowing) &&
          cBorrowLimitUsedHypo > 0 ? (
            <React.Fragment>
              <span>-&gt;</span>{" "}
              {truncateNumber(cBorrowLimitUsedHypo.toString()) + "%"}
            </React.Fragment>
          ) : null}{" "}
        </Text>
      </Limits>
      <LimitBar
        progress={!token.collateral ? cBorrowLimitUsed : cBorrowLimitUsedHypo}
      />
    </DetailStyled>
  );
};

const DetailStyled = styled.div`
  background: #0b0b0b;
  border: 1px solid #2f2f2f;
  border-radius: 4px;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2rem;
    .header {
      color: #9b9b9b;
    }
  }
`;

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

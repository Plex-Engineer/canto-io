import styled from "@emotion/styled";
import CANTO from "assets/icons/canto.png";
import { noteSymbol } from "global/utils/utils";

enum TrasanctionType {
  SUPPLY,
  WITHDRAW,
  BORROW,
  REPAY,
  ENABLE,
}

interface IDetailProps {
  borrowLimit: number;
  borrowLimitUsed: number;
  icon: string;
  amount: number;
  token: any;
  isBorrowing: boolean;
  transactionType: TrasanctionType;
  borrowBalance: number;
}

const Limits = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #222;
  padding: 1.4rem 0;
  span {
    color: var(--primary-color);
  }
  color: #efefef;
`;

const Details = ({
  borrowLimit,
  borrowLimitUsed,
  icon,
  amount,
  token,
  isBorrowing,
  transactionType,
  borrowBalance,
}: IDetailProps) => {
  //Hypothetical Borrow Limit if Amount is supplied
  function ExpectedBorrowLimit() {
    const additionalBorrowLimit =
      token.collateralFactor *
      (transactionType == TrasanctionType.SUPPLY ? amount : -amount);
    const additionalBorrowLimitInNote = additionalBorrowLimit * token.price;
    return additionalBorrowLimitInNote + borrowLimit;
  }

  //Hypothetical Borrow Limit Used If About to supply/withdraw
  function ExpectedBorrowLimitUsed(ExpectedBorrowLimit: number) {
    return borrowBalance / ExpectedBorrowLimit;
  }

  //Hypothetical Borrow Balance if Borrowing
  function ExpectedBorrowBalanceIfBorrowing() {
    return (
      borrowBalance +
      token.price *
        (transactionType == TrasanctionType.REPAY ? -amount : amount)
    );
  }

  //Hypothetical Borrow Limit Used If Borrowing
  function ExpectedBorrowLimitUsedIfBorrowing() {
    return (ExpectedBorrowBalanceIfBorrowing() / borrowLimit) * 100;
  }

  const cBorrowLimit = isBorrowing
    ? borrowBalance.toFixed(2)
    : borrowLimit.toFixed(2);

  const cBorrowLimitHypo = isBorrowing
    ? ExpectedBorrowBalanceIfBorrowing().toFixed(2)
    : ExpectedBorrowLimit().toFixed(2);

  const cBorrowLimitUsed = borrowLimitUsed.toFixed(2);

  const cBorrowLimitUsedHypo = (
    isBorrowing
      ? ExpectedBorrowLimitUsedIfBorrowing()
      : ExpectedBorrowLimitUsed(ExpectedBorrowLimit()) * 100
  ).toFixed(2);

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
          <p>
            {!isBorrowing ? "supply apr:" : "borrow rate:"}
            {!isBorrowing ? (
              <span>{token.supplyAPY.toFixed(2)}%</span>
            ) : (
              <span>{token.borrowAPY.toFixed(2)}%</span>
            )}
          </p>
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
        <p>{token.collateralFactor * 100}%</p>
      </Limits>
      <Limits>
        <p>borrow {isBorrowing ? "balance" : "limit"}:</p>
        <p>
          {noteSymbol}
          {cBorrowLimit}{" "}
          {amount > 0 && (token.collateral || isBorrowing) ? (
            <span>-&gt;</span>
          ) : null}{" "}
          {(amount && (token.collateral || isBorrowing)) > 0
            ? noteSymbol + cBorrowLimitHypo
            : null}
        </p>
      </Limits>
      <Limits>
        <p>borrow limit used:</p>
        <p>
          {isNaN(Number(cBorrowLimitUsed)) ? 0 : cBorrowLimitUsed}%{" "}
          {(amount && (token.collateral || isBorrowing)) > 0 ? (
            <span>-&gt;</span>
          ) : null}{" "}
          {amount > 0 && (token.collateral || isBorrowing)
            ? (Number(cBorrowLimitUsedHypo) <= 0
                ? Number(cBorrowLimitUsedHypo)
                : cBorrowLimitUsedHypo) + "%"
            : null}
        </p>
      </Limits>
      <LimitBar
        progress={
          !(token.collateral || isBorrowing)
            ? Number(cBorrowLimitUsed)
            : Number(cBorrowLimitUsedHypo)
        }
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

export { Details, LimitBar, TrasanctionType };

import { BigNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { noteSymbol, truncateNumber } from "global/utils/utils";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import { Hero, TinyTable, ToolTipL } from "./Styled";
import CypherText from "./CypherText";
import { BorrowRow, SupplyRow } from "./lendingRow";
import LendingTable from "./table";
import FadeIn from "react-fade-in";

function sortColumnsByType(value1: unknown, value2: unknown) {
  if (typeof value1 === "string") {
    return value1.localeCompare(value2 as string);
  } else if (typeof value1 === "number") {
    return (value2 as number) - (value1 as number);
  } else if (typeof value1 === "boolean") {
    return value1 === value2 ? 0 : value1 ? -1 : 1;
  }
  return 0;
}
interface SupplyingProps {
  visible: boolean;
  supplying: boolean;
  userLMTokens: UserLMTokenDetails[];
  onClick: (userLMToken: UserLMTokenDetails) => void;
  onToggle: (userLMToken: UserLMTokenDetails) => void;
}
export const SupplyTable = ({
  visible,
  supplying,
  userLMTokens,
  onClick,
  onToggle,
}: SupplyingProps) => {
  const [columnClicked, setColumnClicked] = useState(0);
  const columns = supplying
    ? ["asset", "apr", "rewards", "balance", "collateral"]
    : ["asset", "apr", "wallet", "collateral"];
  //this should prevent the table from showing up if there are not items to be displayed
  if (userLMTokens.length == 0 || !visible) return null;

  return (
    <div className="left">
      <p>{supplying ? "supplying" : "available"}</p>

      <LendingTable
        columns={columns}
        isLending
        onColumnClicked={(column) => setColumnClicked(column)}
      >
        {userLMTokens
          .map((token) => {
            const amount = supplying ? token.supplyBalance : token.balanceOf;
            return (
              <SupplyRow
                supplying={supplying}
                collaterable={!token.collateralFactor.isZero()}
                key={token.data.address + "supplying"}
                onClick={() => onClick(token)}
                assetIcon={token.data.underlying.icon}
                assetName={token.data.underlying.symbol}
                apy={token.supplyAPY.toFixed(2)}
                distAPY={token.distAPY.toFixed(2)}
                amount={truncateNumber(
                  formatUnits(amount, token.data.underlying.decimals)
                )}
                amountInNote={truncateNumber(
                  formatUnits(token.supplyBalanceinNote)
                )}
                symbol={token.data.underlying.symbol}
                collateral={token.collateral}
                rewards={truncateNumber(formatUnits(token.rewards))}
                onToggle={() => onToggle(token)}
                sortableProps={[
                  token.data.underlying.symbol,
                  token.distAPY,
                  Number(formatEther(token.rewards)),
                  Number(formatEther(token.supplyBalanceinNote)),
                  token.collateral,
                ]}
              />
            );
          })
          .sort((a, b) => {
            return sortColumnsByType(
              a.props.sortableProps?.[columnClicked],
              b.props.sortableProps?.[columnClicked]
            );
          })}
      </LendingTable>
    </div>
  );
};

interface BorrowingProps {
  visible: boolean;
  borrowing: boolean;
  userLMTokens: UserLMTokenDetails[];
  position: UserLMPosition;
  onClick: (userLMToken: UserLMTokenDetails) => void;
}
export const BorrowingTable = ({
  visible,
  borrowing,
  userLMTokens,
  position,
  onClick,
}: BorrowingProps) => {
  //this should prevent the table from showing up if there are not items to be displayed
  if (userLMTokens.length == 0 || !visible) return null;
  const columns = borrowing
    ? ["asset", "apr/accrued", "balance", "% of limit"]
    : ["asset", "apr", "wallet", "liquidity"];

  return (
    <div className="right">
      <p
        style={{
          textAlign: "right",
        }}
      >
        borrowing
      </p>
      <LendingTable columns={columns} isLending={false}>
        {userLMTokens
          .map((token) => {
            const amount = borrowing ? token.borrowBalance : token.balanceOf;
            const liquidity = borrowing
              ? token.borrowBalanceinNote
                  .mul(100)
                  .div(position.totalBorrowLimit)
                  .toNumber()
              : Number(token.liquidity);
            return (
              <BorrowRow
                borrowing={borrowing}
                key={token.data.address + "borrowed"}
                onClick={() => onClick(token)}
                assetIcon={token.data.underlying.icon}
                assetName={token.data.underlying.symbol}
                apy={token.borrowAPY.toFixed(2)}
                amount={truncateNumber(
                  formatUnits(amount, token.data.underlying.decimals)
                )}
                amountInNote={truncateNumber(
                  formatUnits(token.borrowBalanceinNote)
                )}
                symbol={token.data.underlying.symbol}
                liquidity={liquidity}
              />
            );
          })
          .sort((a, b) => {
            return String(a?.props.symbol).localeCompare(b?.props.symbol);
          })}
      </LendingTable>
    </div>
  );
};

interface LMPositionBarProps {
  borrowBalance: BigNumber;
  borrowLimit: BigNumber;
  supplyBalance: BigNumber;
}
export const LMPositionBar = ({
  borrowBalance,
  borrowLimit,
  supplyBalance,
}: LMPositionBarProps) => {
  const borrowPercentage = !borrowLimit.isZero()
    ? borrowBalance.mul(100).div(borrowLimit)
    : BigNumber.from(0);
  return (
    <React.Fragment>
      <Hero>
        <div>
          <p>supply balance</p>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalSupply.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            {noteSymbol}
            <CypherText
              text={
                supplyBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(supplyBalance, 18))
              }
            />
          </h1>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <p>borrow balance</p>
          {/* <h1 className="balance">{noteSymbol}{stats?.totalBorrow.toFixed(2)??"000.00000"}</h1> */}
          <h1 className="balance">
            {noteSymbol}
            <CypherText
              text={
                borrowBalance.isZero()
                  ? "000.00"
                  : truncateNumber(formatUnits(borrowBalance, 18))
              }
            />
          </h1>
        </div>
      </Hero>
      <Popup
        trigger={
          <TinyTable>
            <div>
              <p>borrow limit</p>
            </div>
            <div className="bar">
              {borrowPercentage.lte(80) ? (
                <div
                  className="green"
                  style={{ width: borrowPercentage.toNumber() + "%" }}
                ></div>
              ) : (
                <div
                  className="red"
                  style={{ width: borrowPercentage.toNumber() + "%" }}
                ></div>
              )}
              <div
                className="gray"
                style={{
                  width: 100 - borrowPercentage.toNumber() + "%",
                }}
              ></div>
            </div>
            <p style={{ width: "100%", textAlign: "right" }}>
              {noteSymbol + formatUnits(borrowLimit)}
            </p>
          </TinyTable>
        }
        position="top center"
        on={["hover", "focus"]}
        arrow={true}
      >
        <ToolTipL>
          {borrowPercentage.lt(80) ? (
            <p>
              you will be liquidated if you go above your borrow limit <br></br>
              Liquidity Cushion:{" "}
              {noteSymbol +
                truncateNumber(formatUnits(borrowLimit.sub(borrowBalance)))}
            </p>
          ) : (
            <p>
              you will be liquidated soon<br></br> Liquidity Cushion:{" "}
              {noteSymbol +
                truncateNumber(formatUnits(borrowLimit.sub(borrowBalance)))}
            </p>
          )}
        </ToolTipL>
      </Popup>
    </React.Fragment>
  );
};

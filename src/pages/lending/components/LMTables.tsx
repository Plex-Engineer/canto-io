import { formatEther, formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { useState } from "react";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import { BorrowRow, SupplyRow } from "./lendingRow";
import LendingTable from "./table";
import { Text } from "global/packages/src";

export function sortColumnsByType(value1: unknown, value2: unknown) {
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
      <Text type="title" size="title3" align="left">
        {supplying ? "supplying" : "supply market"}
      </Text>

      <LendingTable
        columns={columns}
        isLending
        onColumnClicked={(column) => setColumnClicked(column)}
        columnClicked={columnClicked}
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
                sortableProps={
                  supplying
                    ? [
                        token.data.underlying.symbol,
                        token.distAPY,
                        Number(formatEther(token.rewards)),
                        Number(formatEther(token.supplyBalanceinNote)),
                        token.collateral,
                      ]
                    : [
                        token.data.underlying.symbol,
                        token.distAPY,
                        Number(
                          formatUnits(token.balanceOf, token.data.decimals)
                        ),
                        token.collateral,
                      ]
                }
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
  const [columnClicked, setColumnClicked] = useState(0);
  //this should prevent the table from showing up if there are not items to be displayed
  if (userLMTokens.length == 0 || !visible) return null;

  const columns = borrowing
    ? ["asset", "apr/accrued", "balance", "% of limit"]
    : ["asset", "apr", "wallet", "liquidity"];

  return (
    <div className="right">
      <Text type="title" size="title3" align="right">
        {borrowing ? "borrowing" : "borrow market"}
      </Text>
      <LendingTable
        columns={columns}
        isLending={false}
        onColumnClicked={(column) => setColumnClicked(column)}
        columnClicked={columnClicked}
      >
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
                sortableProps={[
                  token.data.underlying.symbol,
                  token.borrowAPY,
                  Number(
                    borrowing
                      ? formatEther(token.borrowBalanceinNote)
                      : formatUnits(
                          token.balanceOf,
                          token.data.underlying.decimals
                        )
                  ),
                  liquidity,
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

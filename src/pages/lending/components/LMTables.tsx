import { formatUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";
import { UserLMPosition, UserLMTokenDetails } from "../config/interfaces";
import { BorrowedRow, SupplyingRow } from "./lendingRow";
import LendingTable from "./lendingTable";

interface SupplyingProps {
  userLMTokens: UserLMTokenDetails[];
  onClick: (userLMToken: UserLMTokenDetails) => void;
  onToggle: (userLMToken: UserLMTokenDetails) => void;
}
export const SupplyingTable = ({
  userLMTokens,
  onClick,
  onToggle,
}: SupplyingProps) => {
  //this should prevent the table from showing up if there are not items to be displayed
  if (userLMTokens?.filter((token) => token.inSupplyMarket).length == 0)
    return null;
  return (
    <div className="left">
      <p>supplying</p>

      <LendingTable
        columns={["asset", "apr", "rewards", "balance", "collateral"]}
        isLending
      >
        {userLMTokens
          .map((token) =>
            token.inSupplyMarket ? (
              <SupplyingRow
                collaterable={!token.collateralFactor.isZero()}
                key={token.data.address + "supplying"}
                onClick={() => onClick(token)}
                assetIcon={token.data.underlying.icon}
                assetName={token.data.underlying.symbol}
                apy={token.supplyAPY.toFixed(2)}
                distAPY={token.distAPY.toFixed(2)}
                wallet={truncateNumber(
                  formatUnits(
                    token.supplyBalance,
                    token.data.underlying.decimals
                  )
                )}
                balance={truncateNumber(formatUnits(token.supplyBalanceinNote))}
                symbol={token.data.underlying.symbol}
                collateral={token.collateral}
                rewards={truncateNumber(formatUnits(token.rewards))}
                onToggle={() => onToggle(token)}
              />
            ) : null
          )
          .sort((a, b) => {
            return String(a?.props.symbol).localeCompare(b?.props.symbol);
          })}
      </LendingTable>
    </div>
  );
};

interface BorrowingProps {
  userLMTokens: UserLMTokenDetails[];
  position: UserLMPosition;
  onClick: (userLMToken: UserLMTokenDetails) => void;
}
export const BorrowingTable = ({
  userLMTokens,
  position,
  onClick,
}: BorrowingProps) => {
  //this should prevent the table from showing up if there are not items to be displayed
  if (userLMTokens?.filter((token) => token.inBorrowMarket).length == 0)
    return null;

  return (
    <div className="right">
      <p
        style={{
          textAlign: "right",
        }}
      >
        borrowing
      </p>
      <LendingTable
        columns={["asset", "apr/accrued", "balance", "% of limit"]}
        isLending={false}
      >
        {userLMTokens
          .map((token) =>
            token.inBorrowMarket ? (
              <BorrowedRow
                key={token.data.address + "borrowed"}
                onClick={() => onClick(token)}
                assetIcon={token.data.underlying.icon}
                assetName={token.data.underlying.symbol}
                apy={token.borrowAPY.toFixed(2)}
                balance={truncateNumber(formatUnits(token.borrowBalanceinNote))}
                symbol={token.data.underlying.symbol}
                wallet={truncateNumber(
                  formatUnits(
                    token.borrowBalance,
                    token.data.underlying.decimals
                  )
                )}
                liquidity={token.borrowBalanceinNote
                  .mul(100)
                  .div(position.totalBorrowLimit)
                  .toNumber()}
              />
            ) : null
          )
          .sort((a, b) => {
            return String(a?.props.symbol).localeCompare(b?.props.symbol);
          })}
      </LendingTable>
    </div>
  );
};

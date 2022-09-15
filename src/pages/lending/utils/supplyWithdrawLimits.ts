//used and limit both in terms of note, collateral factor is raised to 10^18

import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { convertBigNumberRatioIntoPercentage } from "global/utils/utils";

//percent of limit will give how much, in terms of underlying can be withdrawn to stay under this limit
export function maxWithdrawalInUnderlying(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number,
  price: BigNumber,
  tokenDecimals: number
) {
  if (collateralFactor.isZero() || price.isZero() || tokenDecimals == 0) {
    return ethers.constants.MaxUint256;
  }
  if (percentOfLimit == 0) {
    return BigNumber.from(0);
  }
  const max = limit
    .sub(used.mul(100).div(percentOfLimit))
    .mul(BigNumber.from(10).pow(18 + tokenDecimals))
    .div(collateralFactor.mul(price));

  return max.isNegative() ? BigNumber.from(0) : max;
}

//will return boolean for if withdrawal of the token at its price will go over the limit
//withdraw amount will be the amount of the token in terms of underlying
export function willWithdrawalGoOverLimit(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number,
  withdrawAmount: BigNumber,
  price: BigNumber,
  tokenDecimals: number
) {
  if (used.isZero()) {
    return false;
  }
  return maxWithdrawalInUnderlying(
    used,
    limit,
    collateralFactor,
    percentOfLimit,
    price,
    tokenDecimals
  ).lt(withdrawAmount);
}

//will return the change in borrow limit for supply/withdraw
export function newBorrowLimit(
  supply: boolean,
  amount: BigNumber,
  tokenDecimals: number,
  collateralFactor: BigNumber,
  price: BigNumber,
  currentLimit: BigNumber
) {
  if (tokenDecimals == 0) {
    return BigNumber.from(currentLimit);
  }
  const amountInNote = amount
    .mul(price)
    .div(BigNumber.from(10).pow(tokenDecimals));
  const change = amountInNote
    .mul(collateralFactor)
    .div(BigNumber.from(10).pow(18));
  const newLimit = supply ? currentLimit.add(change) : currentLimit.sub(change);
  return newLimit.gte(0) ? newLimit : BigNumber.from(0);
}

export function expectedBorrowLimitUsedInSupplyOrWithdraw(
  supply: boolean,
  amount: BigNumber,
  tokenDecimals: number,
  collateralFactor: BigNumber,
  price: BigNumber,
  currentLimit: BigNumber,
  currentBorrows: BigNumber
) {
  const expectedBorrowLimit = newBorrowLimit(
    supply,
    amount,
    tokenDecimals,
    collateralFactor,
    price,
    currentLimit
  );
  if (expectedBorrowLimit.lte(0)) {
    return 0;
  }
  return convertBigNumberRatioIntoPercentage(
    currentBorrows,
    expectedBorrowLimit
  );
}
/*
returns [
  max amount when user hits max button (80%) limit/max limit, 
  max amount user can manually withdraw, 
  boolean for if amount clicked is total supply or up to 80% limit]
*/
export function userMaximumWithdrawal(
  supplyBalance: BigNumber,
  tokenDecimals: number,
  totalBorrow: BigNumber,
  borrowLimit: BigNumber,
  collateralFactor: BigNumber,
  price: BigNumber,
  isCollateral: boolean
): [BigNumber, BigNumber, boolean] {
  if (!isCollateral) {
    return [supplyBalance, supplyBalance, true];
  } else {
    const eightyPercentLimit = maxWithdrawalInUnderlying(
      totalBorrow,
      borrowLimit,
      collateralFactor,
      80,
      price,
      tokenDecimals
    );
    const totalLimit = maxWithdrawalInUnderlying(
      totalBorrow,
      borrowLimit,
      collateralFactor,
      100,
      price,
      tokenDecimals
    );
    const canWithdrawAllFor80Percent = supplyBalance.lte(eightyPercentLimit);
    const canWithdrawAllForTotalLimit = supplyBalance.lte(totalLimit);
    if (canWithdrawAllFor80Percent) {
      return [supplyBalance, supplyBalance, true];
    } else if (canWithdrawAllForTotalLimit) {
      return [eightyPercentLimit, supplyBalance, false];
    } else {
      return [eightyPercentLimit, totalLimit, false];
    }
  }
}

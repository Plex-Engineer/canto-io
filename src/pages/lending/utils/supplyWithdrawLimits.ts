//used and limit both in terms of note, collateral factor is raised to 10^18

import { BigNumber, ethers } from "ethers";

//percent of limit will give how much, in terms of underlying can be withdrawn to stay under this limit
export function maxWithdrawalInUnderlying(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number,
  price: BigNumber,
  tokenDecimals: number
) {
  if (collateralFactor.isZero() || price.isZero()) {
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
  return supply ? currentLimit.add(change) : currentLimit.sub(change);
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
  if (expectedBorrowLimit.isZero()) {
    return 0;
  }
  return currentBorrows.mul(100).div(expectedBorrowLimit).toNumber();
}

//return the BigNumber of the value when the user hits max, as well as the boolean for whether or not this is the maximum or 80% limit
export function userMaximumWithdrawal(
  supplyBalance: BigNumber,
  tokenDecimals: number,
  totalBorrow: BigNumber,
  borrowLimit: BigNumber,
  collateralFactor: BigNumber,
  price: BigNumber,
  isCollateral: boolean
): [BigNumber, boolean] {
  const withdrawLimit80Percent =
    isCollateral &&
    willWithdrawalGoOverLimit(
      totalBorrow,
      borrowLimit,
      collateralFactor,
      80,
      supplyBalance,
      price,
      tokenDecimals
    )
      ? maxWithdrawalInUnderlying(
          totalBorrow,
          borrowLimit,
          collateralFactor,
          80,
          price,
          tokenDecimals
        )
      : undefined;

  if (!withdrawLimit80Percent) {
    return [supplyBalance, true];
  } else {
    if (!withdrawLimit80Percent.lte(0)) {
      return [withdrawLimit80Percent, false];
    }
  }

  return [BigNumber.from(0), false];
}

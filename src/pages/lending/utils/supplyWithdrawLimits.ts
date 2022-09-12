//used and limit both in terms of note, collateral factor is raised to 10^18

import { BigNumber } from "ethers";

//percent of limit will give how much, in terms of note can be withdrawn to stay under this limit
export function maxWithdrawalInUnderlying(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number,
  price: BigNumber,
  tokenDecimals: number
) {
  if (collateralFactor.isZero() || price.isZero() || percentOfLimit == 0) {
    return BigNumber.from(0);
  }
  return limit
    .sub(used.mul(100).div(percentOfLimit))
    .mul(BigNumber.from(10).pow(18 + tokenDecimals))
    .div(collateralFactor.mul(price));
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
    return BigNumber.from(0);
  }
  return currentBorrows.mul(100).div(expectedBorrowLimit).toNumber();
}

//returns the borrow amount for the user in repay/borrow modal
export function newBorrowAmount(
  borrow: boolean,
  amount: BigNumber,
  tokenDecimals: number,
  borrowBalance: BigNumber,
  price: BigNumber
) {
  if (tokenDecimals == 0) {
    return BigNumber.from(borrowBalance);
  }
  const amountInNote = amount
    .mul(price)
    .div(BigNumber.from(10).pow(tokenDecimals));
  return borrow
    ? borrowBalance.add(amountInNote)
    : borrowBalance.sub(amountInNote);
}

export function expectedBorrowLimitUsedInBorrowOrRepay(
  borrow: boolean,
  amount: BigNumber,
  tokenDecimals: number,
  borrowBalance: BigNumber,
  price: BigNumber,
  currentLimit: BigNumber
) {
  if (currentLimit.isZero()) {
    return BigNumber.from(0);
  }
  const expectedBorrowAmount = newBorrowAmount(
    borrow,
    amount,
    tokenDecimals,
    borrowBalance,
    price
  );
  return expectedBorrowAmount.mul(100).div(currentLimit);
}

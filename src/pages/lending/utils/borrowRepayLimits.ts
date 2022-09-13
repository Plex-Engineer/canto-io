import { BigNumber } from "ethers";

//percent of limit will give how much, in terms of underlying can be borrowed to stay under this limit
export function maxBorrowInUnderlying(
  used: BigNumber,
  limit: BigNumber,
  percentOfLimit: number,
  price: BigNumber,
  tokenDecimals: number
) {
  if (price.isZero() || percentOfLimit == 0) {
    return BigNumber.from(0);
  }
  return limit
    .mul(percentOfLimit)
    .div(100)
    .sub(used)
    .mul(BigNumber.from(10).pow(tokenDecimals))
    .div(price);
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

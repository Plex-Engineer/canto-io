import { BigNumber } from "ethers";
import { convertBigNumberRatioIntoPercentage } from "global/utils/utils";

//percent of limit will give how much, in terms of underlying can be borrowed to stay under this limit
export function maxBorrowInUnderlying(
  used: BigNumber,
  limit: BigNumber,
  percentOfLimit: number,
  price: BigNumber
) {
  if (price.isZero() || percentOfLimit == 0) {
    return BigNumber.from(0);
  }
  //price factors in decimals and scaled to 1e18, so we do not need to know the token decimals for undelrlying borrows
  return limit
    .mul(percentOfLimit)
    .div(100)
    .sub(used)
    .mul(BigNumber.from(10).pow(18))
    .div(price);
}

//returns the borrow amount for the user in repay/borrow modal
export function newBorrowAmount(
  borrow: boolean,
  amount: BigNumber,
  borrowBalance: BigNumber,
  price: BigNumber
) {
  const amountInNote = amount.mul(price).div(BigNumber.from(10).pow(18));
  return borrow
    ? borrowBalance.add(amountInNote)
    : borrowBalance.sub(amountInNote);
}

export function expectedBorrowLimitUsedInBorrowOrRepay(
  borrow: boolean,
  amount: BigNumber,
  borrowBalance: BigNumber,
  price: BigNumber,
  currentLimit: BigNumber
) {
  if (currentLimit.isZero()) {
    return 0;
  }
  const expectedBorrowAmount = newBorrowAmount(
    borrow,
    amount,
    borrowBalance,
    price
  );

  return convertBigNumberRatioIntoPercentage(
    expectedBorrowAmount,
    currentLimit
  );
}

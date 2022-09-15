import { parseUnits } from "ethers/lib/utils";
import {
  expectedBorrowLimitUsedInBorrowOrRepay,
  maxBorrowInUnderlying,
  newBorrowAmount,
} from "pages/lending/utils/borrowRepayLimits";

test("Max borrow in underlying", () => {
  const testCases = [
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      expected: parseUnits("9000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 50,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      expected: parseUnits("4000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 100,
      price: parseUnits("1.5", 30),
      tokenDecimals: 6,
      expected: parseUnits("6000", 6),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 80,
      price: parseUnits("1.5", 30),
      tokenDecimals: 6,
      expected: parseUnits("4666.666666", 6),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 0,
      price: parseUnits("1.5", 30),
      tokenDecimals: 6,
      expected: parseUnits("0", 6),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      percentOfLimit: 50,
      price: parseUnits("0", 30),
      tokenDecimals: 6,
      expected: parseUnits("0", 6),
    },
  ];
  for (const testCase of testCases) {
    const test = maxBorrowInUnderlying(
      testCase.used,
      testCase.limit,
      testCase.percentOfLimit,
      testCase.price
    );
    expect(test).toEqual(testCase.expected);
  }
});

test("New borrow amount", () => {
  const testCases = [
    {
      borrow: true,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("1", 18),
      expected: parseUnits("2000", 18),
    },
    {
      borrow: false,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("1", 18),
      expected: parseUnits("0", 18),
    },
    {
      borrow: true,
      amount: parseUnits("10000", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("5", 30),
      expected: parseUnits("51000", 18),
    },
    {
      borrow: false,
      amount: parseUnits("2000", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("0.5", 30),
      expected: parseUnits("0", 18),
    },
    {
      borrow: true,
      amount: parseUnits("2000", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("0", 30),
      expected: parseUnits("1000", 18),
    },
    {
      borrow: false,
      amount: parseUnits("2000", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("0", 30),
      expected: parseUnits("1000", 18),
    },
  ];
  for (const testCase of testCases) {
    const test = newBorrowAmount(
      testCase.borrow,
      testCase.amount,
      testCase.borrowBalance,
      testCase.price
    );
    expect(test).toEqual(testCase.expected);
  }
});

test("Expected borrow limit used for borrows", () => {
  const testCases = [
    {
      borrow: true,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      expected: 0.2,
    },
    {
      borrow: true,
      amount: parseUnits("6500", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      expected: 0.75,
    },
    {
      borrow: true,
      amount: parseUnits("1.01", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("0", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10", 18),
      expected: 0.101,
    },
    {
      borrow: true,
      amount: parseUnits("1.01", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("0", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("0", 18),
      expected: 0,
    },
    {
      borrow: true,
      amount: parseUnits("10", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("0", 18),
      price: parseUnits("0.5", 30),
      currentLimit: parseUnits("10", 18),
      expected: 0.5,
    },
    {
      borrow: true,
      amount: parseUnits("10", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("20", 18),
      price: parseUnits("0", 30),
      currentLimit: parseUnits("50", 18),
      expected: 0.4,
    },
  ];
  for (const testCase of testCases) {
    const test = expectedBorrowLimitUsedInBorrowOrRepay(
      testCase.borrow,
      testCase.amount,
      testCase.borrowBalance,
      testCase.price,
      testCase.currentLimit
    );
    expect(test).toEqual(testCase.expected);
  }
});

test("Expected borrow limit used for repays", () => {
  const testCases = [
    {
      borrow: false,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("1000", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      expected: 0,
    },
    {
      borrow: false,
      amount: parseUnits("1500", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("9000", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      expected: 0.75,
    },
    {
      borrow: false,
      amount: parseUnits("8.99", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("10", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10", 18),
      expected: 0.101,
    },
    {
      borrow: false,
      amount: parseUnits("1.01", 18),
      tokenDecimals: 18,
      borrowBalance: parseUnits("0", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("0", 18),
      expected: 0,
    },
    {
      borrow: false,
      amount: parseUnits("10", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("20", 18),
      price: parseUnits("0.5", 30),
      currentLimit: parseUnits("50", 18),
      expected: 0.3,
    },
    {
      borrow: false,
      amount: parseUnits("10", 6),
      tokenDecimals: 6,
      borrowBalance: parseUnits("20", 18),
      price: parseUnits("0", 30),
      currentLimit: parseUnits("50", 18),
      expected: 0.4,
    },
  ];
  for (const testCase of testCases) {
    const test = expectedBorrowLimitUsedInBorrowOrRepay(
      testCase.borrow,
      testCase.amount,
      testCase.borrowBalance,
      testCase.price,
      testCase.currentLimit
    );
    expect(test).toEqual(testCase.expected);
  }
});

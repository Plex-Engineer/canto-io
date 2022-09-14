/* eslint-disable sonarjs/no-duplicate-string */
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  expectedBorrowLimitUsedInSupplyOrWithdraw,
  maxWithdrawalInUnderlying,
  newBorrowLimit,
  userMaximumWithdrawal,
  willWithdrawalGoOverLimit,
} from "pages/lending/utils/supplyWithdrawLimits";

test("Max withdrawal in underlying", () => {
  const testCases = [
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("1", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("9000", 18),
          expected: true,
        },
        {
          amount: parseUnits("8999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("9000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("9000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("1", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 6,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 6),
          expected: true,
        },
        {
          amount: parseUnits("9000", 6),
          expected: true,
        },
        {
          amount: parseUnits("8999.999999", 6),
          expected: true,
        },
        {
          amount: parseUnits("9000.000001", 6),
          expected: false,
        },
      ],
      expected: parseUnits("9000", 6),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("9000", 18),
          expected: true,
        },
        {
          amount: parseUnits("15999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("16000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("16000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("0.5", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("9000", 18),
          expected: true,
        },
        {
          amount: parseUnits("31999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("32000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("40000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("32000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("2", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("8000", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("2", 18),
      tokenDecimals: 6,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 6),
          expected: true,
        },
        {
          amount: parseUnits("7999.999999", 6),
          expected: true,
        },
        {
          amount: parseUnits("8000.000001", 6),
          expected: false,
        },
        {
          amount: parseUnits("20000.000001", 6),
          expected: false,
        },
      ],
      expected: parseUnits("8000", 6),
    },

    //edge cases
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: false,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: false,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("0", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: false,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: false,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("0", 18),
    },
    {
      used: parseUnits("100000", 18),
      limit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: false,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: false,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("0", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 100,
      price: parseUnits("1", 18),
      tokenDecimals: 6,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 6),
          expected: false,
        },
        {
          amount: parseUnits("7999.999999", 6),
          expected: false,
        },
        {
          amount: parseUnits("8000.000001", 6),
          expected: false,
        },
        {
          amount: parseUnits("20000.000001", 6),
          expected: false,
        },
      ],
      expected: parseUnits("0", 6),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 0,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: false,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: false,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: false,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: false,
        },
      ],
      expected: parseUnits("0", 18),
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0", 18),
      percentOfLimit: 50,
      price: parseUnits("1", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: true,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: true,
        },
      ],
      expected: ethers.constants.MaxUint256,
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("0", 18),
      tokenDecimals: 18,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 18),
          expected: true,
        },
        {
          amount: parseUnits("7999.999999999999999999", 18),
          expected: true,
        },
        {
          amount: parseUnits("8000.000000000000000001", 18),
          expected: true,
        },
        {
          amount: parseUnits("20000.000000000000000001", 18),
          expected: true,
        },
      ],
      expected: ethers.constants.MaxUint256,
    },
    {
      used: parseUnits("1000", 18),
      limit: parseUnits("10000", 18),
      collateralFactor: parseUnits("0.5", 18),
      percentOfLimit: 50,
      price: parseUnits("0", 18),
      tokenDecimals: 6,
      withdrawalAmounts: [
        {
          amount: parseUnits("1000", 6),
          expected: true,
        },
        {
          amount: parseUnits("7999.999999", 6),
          expected: true,
        },
        {
          amount: parseUnits("8000.000001", 6),
          expected: true,
        },
        {
          amount: parseUnits("20000.000001", 6),
          expected: true,
        },
      ],
      expected: ethers.constants.MaxUint256,
    },
  ];
  for (const testCase of testCases) {
    const test = maxWithdrawalInUnderlying(
      testCase.used,
      testCase.limit,
      testCase.collateralFactor,
      testCase.percentOfLimit,
      testCase.price,
      testCase.tokenDecimals
    );
    for (const withdrawalAmount of testCase.withdrawalAmounts) {
      const ableToWithdraw = !willWithdrawalGoOverLimit(
        testCase.used,
        testCase.limit,
        testCase.collateralFactor,
        testCase.percentOfLimit,
        withdrawalAmount.amount,
        testCase.price,
        testCase.tokenDecimals
      );
      expect(ableToWithdraw).toBe(withdrawalAmount.expected);
    }

    expect(test).toEqual(testCase.expected);
  }
});

test("New Borrow Limit For Supply", () => {
  const testCases = [
    {
      supply: true,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("1", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("0", 18),
      expectedLimit: parseUnits("2000", 18),
      expectedLimitUsed: 0,
    },
    {
      supply: true,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("0", 18),
      expectedLimit: parseUnits("1500", 18),
      expectedLimitUsed: 0,
    },
    {
      supply: true,
      amount: parseUnits("10000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0.5", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("350", 18),
      expectedLimit: parseUnits("3500", 18),
      expectedLimitUsed: 10,
    },
    {
      supply: true,
      amount: parseUnits("10000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0.5", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("3.5", 18),
      expectedLimit: parseUnits("3500", 18),
      expectedLimitUsed: 0.1,
    },
    {
      supply: true,
      amount: parseUnits("10000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0.5", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("7000", 18),
      expectedLimit: parseUnits("3500", 18),
      expectedLimitUsed: 200,
    },
    {
      supply: true,
      amount: parseUnits("10000", 6),
      tokenDecimals: 6,
      collateralFactor: parseUnits("1", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("0", 18),
      currentBorrows: parseUnits("3333", 18),
      expectedLimit: parseUnits("10000", 18),
      expectedLimitUsed: 33.33,
    },
    {
      supply: true,
      amount: parseUnits("10000", 6),
      tokenDecimals: 0,
      collateralFactor: parseUnits("1", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("500", 18),
      expectedLimit: parseUnits("1000", 18),
      expectedLimitUsed: 50,
    },
  ];
  for (const testCase of testCases) {
    const testLimit = newBorrowLimit(
      testCase.supply,
      testCase.amount,
      testCase.tokenDecimals,
      testCase.collateralFactor,
      testCase.price,
      testCase.currentLimit
    );
    const testLimitUsed = expectedBorrowLimitUsedInSupplyOrWithdraw(
      testCase.supply,
      testCase.amount,
      testCase.tokenDecimals,
      testCase.collateralFactor,
      testCase.price,
      testCase.currentLimit,
      testCase.currentBorrows
    );
    expect(testLimit).toEqual(testCase.expectedLimit);
    expect(testLimitUsed).toEqual(testCase.expectedLimitUsed);
  }
});

test("New Borrow Limit For Withdraw", () => {
  const testCases = [
    {
      supply: false,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("1", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("0", 18),
      expectedLimit: parseUnits("0", 18),
      expectedLimitUsed: 0,
    },
    {
      supply: false,
      amount: parseUnits("1000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      currentBorrows: parseUnits("0", 18),
      expectedLimit: parseUnits("9500", 18),
      expectedLimitUsed: 0,
    },
    {
      supply: false,
      amount: parseUnits("10000", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0.5", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("350", 18),
      expectedLimit: parseUnits("0", 18),
      expectedLimitUsed: 0,
    },
    {
      supply: false,
      amount: parseUnits("0", 18),
      tokenDecimals: 18,
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0.5", 18),
      currentLimit: parseUnits("1000", 18),
      currentBorrows: parseUnits("7000", 18),
      expectedLimit: parseUnits("1000", 18),
      expectedLimitUsed: 700,
    },
    {
      supply: false,
      amount: parseUnits("10000", 6),
      tokenDecimals: 6,
      collateralFactor: parseUnits(".5", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      currentBorrows: parseUnits("7000", 18),
      expectedLimit: parseUnits("5000", 18),
      expectedLimitUsed: 140,
    },
    {
      supply: false,
      amount: parseUnits("20000", 6),
      tokenDecimals: 6,
      collateralFactor: parseUnits(".5", 18),
      price: parseUnits("1", 18),
      currentLimit: parseUnits("10000", 18),
      currentBorrows: parseUnits("7000", 18),
      expectedLimit: parseUnits("0", 18),
      expectedLimitUsed: 0,
    },
  ];
  for (const testCase of testCases) {
    const testLimit = newBorrowLimit(
      testCase.supply,
      testCase.amount,
      testCase.tokenDecimals,
      testCase.collateralFactor,
      testCase.price,
      testCase.currentLimit
    );
    const testLimitUsed = expectedBorrowLimitUsedInSupplyOrWithdraw(
      testCase.supply,
      testCase.amount,
      testCase.tokenDecimals,
      testCase.collateralFactor,
      testCase.price,
      testCase.currentLimit,
      testCase.currentBorrows
    );
    expect(testLimit).toEqual(testCase.expectedLimit);
    expect(testLimitUsed).toEqual(testCase.expectedLimitUsed);
  }
});

//should all return supply balance since not collateralized
test("User maximum withdrawal without collateral", () => {
  const testCases = [
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("1000", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: false,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 0,
      totalBorrow: parseUnits("1000", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: false,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("444", 18),
      borrowLimit: parseUnits("53453", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: false,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("1000", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.001", 18),
      price: parseUnits("100", 18),
      isCollateral: false,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 0,
      totalBorrow: parseUnits("0", 18),
      borrowLimit: parseUnits("0", 18),
      collateralFactor: parseUnits("0.0", 18),
      price: parseUnits("0", 18),
      isCollateral: false,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
  ];
  for (const testCase of testCases) {
    const maximums = userMaximumWithdrawal(
      testCase.supplyBalance,
      testCase.tokenDecimals,
      testCase.totalBorrow,
      testCase.borrowLimit,
      testCase.collateralFactor,
      testCase.price,
      testCase.isCollateral
    );
    expect(maximums).toStrictEqual(testCase.expected);
  }
});
//All tests will use 80 percent as the baseline since UI buttons refer to 80% limits
test("User maximum withdrawal with collateral", () => {
  const testCases = [
    {
      supplyBalance: parseUnits("1000", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("0", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("1", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("1000", 18), parseUnits("1000", 18), true],
    },
    {
      supplyBalance: parseUnits("2400", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("800", 18),
      borrowLimit: parseUnits("2000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 18), parseUnits("2400", 18), false],
    },
    {
      supplyBalance: parseUnits("3000", 18),
      tokenDecimals: 18,
      totalBorrow: parseUnits("800", 18),
      borrowLimit: parseUnits("2000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 18), parseUnits("2400", 18), false],
    },
    {
      supplyBalance: parseUnits("1100", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("1000", 6), parseUnits("1100", 6), false],
    },
    {
      supplyBalance: parseUnits("1200", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("1000", 6), parseUnits("1200", 6), false],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("1000", 6), parseUnits("1200", 6), false],
    },
    //edge cases
    {
      supplyBalance: parseUnits("0", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("0", 6), parseUnits("0", 6), true],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 0,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 6), parseUnits("2000", 6), true],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("0", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 6), parseUnits("2000", 6), true],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("0", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("0", 6), parseUnits("0", 6), false],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0", 18),
      price: parseUnits("1", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 6), parseUnits("2000", 6), true],
    },
    {
      supplyBalance: parseUnits("2000", 6),
      tokenDecimals: 6,
      totalBorrow: parseUnits("400", 18),
      borrowLimit: parseUnits("1000", 18),
      collateralFactor: parseUnits("0.5", 18),
      price: parseUnits("0", 18),
      isCollateral: true,
      expected: [parseUnits("2000", 6), parseUnits("2000", 6), true],
    },
  ];
  for (const testCase of testCases) {
    const maximums = userMaximumWithdrawal(
      testCase.supplyBalance,
      testCase.tokenDecimals,
      testCase.totalBorrow,
      testCase.borrowLimit,
      testCase.collateralFactor,
      testCase.price,
      testCase.isCollateral
    );
    expect(maximums).toStrictEqual(testCase.expected);
  }
});

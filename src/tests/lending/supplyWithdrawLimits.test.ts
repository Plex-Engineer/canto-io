/* eslint-disable sonarjs/no-duplicate-string */
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  maxWithdrawalInUnderlying,
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

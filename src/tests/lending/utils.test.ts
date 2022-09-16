import { parseUnits } from "ethers/lib/utils";
import { getSupplyBalanceFromCTokens } from "pages/lending/utils/utils";

test("Get Supply Balance From cToken Balance", () => {
  const testCases = [
    {
      cTokenBalance: parseUnits("1", 18),
      exchangeRate: parseUnits("1", 18),
      cDecimals: 18,
      underlyingDecimals: 18,
      expected: parseUnits("1", 18),
    },
    {
      cTokenBalance: parseUnits("10", 18),
      exchangeRate: parseUnits("1.2", 18),
      cDecimals: 18,
      underlyingDecimals: 18,
      expected: parseUnits("12", 18),
    },
    {
      cTokenBalance: parseUnits("10", 6),
      exchangeRate: parseUnits("1.2", 18),
      cDecimals: 6,
      underlyingDecimals: 18,
      expected: parseUnits("12", 18),
    },
    {
      cTokenBalance: parseUnits("10", 18),
      exchangeRate: parseUnits("1.2", 18),
      cDecimals: 18,
      underlyingDecimals: 6,
      expected: parseUnits("12", 6),
    },
  ];
  for (const testCase of testCases) {
    const result = getSupplyBalanceFromCTokens(
      testCase.cTokenBalance,
      testCase.exchangeRate,
      testCase.cDecimals,
      testCase.underlyingDecimals
    );
    expect(result).toEqual(testCase.expected);
  }
});

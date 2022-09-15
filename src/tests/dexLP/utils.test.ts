import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  calculateExpectedShareofLP,
  getLPPairRatio,
  getToken1Limit,
  getToken2Limit,
  getTokenAFromB,
  getTokenBFromA,
} from "pages/dexLP/utils/utils";

test("Get LP Pair Ratio", () => {
  const testCases = [
    {
      token1: parseUnits("100", 18),
      token2: parseUnits("100", 18),
      expected: [parseUnits("1", 18), true],
    },
    {
      token1: parseUnits("500", 18),
      token2: parseUnits("100", 18),
      expected: [parseUnits("5", 18), true],
    },
    {
      token1: parseUnits("100", 18),
      token2: parseUnits("500", 18),
      expected: [parseUnits("5", 18), false],
    },
    {
      token1: parseUnits("150", 18),
      token2: parseUnits("100", 18),
      expected: [parseUnits("1.5", 18), true],
    },
    {
      token1: parseUnits("45", 18),
      token2: parseUnits("82", 18),
      expected: [parseUnits("1.822222222222222222", 18), false],
    },
    {
      token1: parseUnits("100", 18),
      token2: parseUnits("100", 6),
      expected: [parseUnits("1", 30), true],
    },
    {
      token1: parseUnits("100", 18),
      token2: parseUnits("200", 6),
      expected: [parseUnits("0.5", 30), true],
    },
    {
      token1: parseUnits("100", 6),
      token2: parseUnits("100", 18),
      expected: [parseUnits("1", 30), false],
    },
    {
      token1: parseUnits("100", 6),
      token2: parseUnits("200", 18),
      expected: [parseUnits("2", 30), false],
    },
  ];
  for (const testCase of testCases) {
    const result = getLPPairRatio(testCase.token1, testCase.token2);
    expect(result).toStrictEqual(testCase.expected);
  }
});

test("calculating amount from LP ratio", () => {
  const testCases = [
    {
      tokenAAmount: parseUnits("1", 18),
      tokenBAmount: parseUnits("1", 18),
      ratio: parseUnits("1", 18),
      atob: true,
    },
    {
      tokenAAmount: parseUnits("2", 18),
      tokenBAmount: parseUnits("1", 18),
      ratio: parseUnits("2", 18),
      atob: true,
    },
    {
      tokenAAmount: parseUnits("8", 18),
      tokenBAmount: parseUnits("10", 18),
      ratio: parseUnits("1.25", 18),
      atob: false,
    },
    {
      tokenAAmount: parseUnits("1", 18),
      tokenBAmount: parseUnits("1", 6),
      ratio: parseUnits("1", 30),
      atob: true,
    },
    {
      tokenAAmount: parseUnits("1", 6),
      tokenBAmount: parseUnits("1", 18),
      ratio: parseUnits("1", 30),
      atob: false,
    },
  ];

  const testReturnsA = testCases.map((testCase) =>
    getTokenAFromB(testCase.tokenBAmount, testCase.ratio, testCase.atob)
  );
  const testReturnsB = testCases.map((testCase) =>
    getTokenBFromA(testCase.tokenAAmount, testCase.ratio, testCase.atob)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturnsA[i]).toStrictEqual(testCases[i].tokenAAmount);
    expect(testReturnsB[i]).toStrictEqual(testCases[i].tokenBAmount);
  }
});

// test("calculating expected share of LP", () => {
//   const testCases = [
//     { expectedLPOut: "1", currentLP: "0", totalLP: "99", expected: 1 },
//     { expectedLPOut: "5", currentLP: "5", totalLP: "95", expected: 10 },
//   ];

//   const testReturns = testCases.map((testCase) =>
//     calculateExpectedShareofLP(
//       testCase.expectedLPOut,
//       testCase.currentLP,
//       testCase.totalLP
//     )
//   );
//   for (let i = 0; i < testCases.length; i++) {
//     expect(testReturns[i]).toBeCloseTo(testCases[i].expected);
//   }
// });

// test("calculating LP token limits", () => {
//   const testCases = [
//     { balanceA: 1, balanceB: 1, ratio: 1, limitA: "1", limitB: "1" },
//     { balanceA: 100, balanceB: 1, ratio: 1, limitA: "1", limitB: "1" },
//     { balanceA: 100, balanceB: 1, ratio: 0.5, limitA: "0.5", limitB: "1" },
//     { balanceA: 50, balanceB: 10, ratio: 10, limitA: "50", limitB: "5" },
//     { balanceA: 400, balanceB: 50, ratio: 0.01, limitA: "0.5", limitB: "50" },
//   ];

//   const testLimitsA = testCases.map((testCase) =>
//     getToken1Limit(testCase.balanceA, testCase.balanceB, testCase.ratio)
//   );
//   const testLimitsB = testCases.map((testCase) =>
//     getToken2Limit(testCase.balanceA, testCase.balanceB, testCase.ratio)
//   );
//   for (let i = 0; i < testCases.length; i++) {
//     expect(testLimitsA[i]).toBe(testCases[i].limitA);
//     expect(testLimitsB[i]).toBe(testCases[i].limitB);
//   }
// });

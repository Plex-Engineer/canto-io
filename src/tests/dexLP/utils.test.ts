import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { MAINPAIRS } from "pages/dexLP/config/pairs";
import {
  calculateExpectedShareofLP,
  checkForCantoInPair,
  getLPPairRatio,
  getToken1Limit,
  getToken2Limit,
  getTokenAFromB,
  getTokenBFromA,
} from "pages/dexLP/utils/utils";

test("check for canto in pair", () => {
  const testCases = [
    {
      pair: MAINPAIRS[0],
      chainId: 7700,
      expected: [true, false],
    },
    {
      pair: MAINPAIRS[1],
      chainId: 7700,
      expected: [true, false],
    },
    {
      pair: MAINPAIRS[2],
      chainId: 7700,
      expected: [true, false],
    },
    {
      pair: MAINPAIRS[3],
      chainId: 7700,
      expected: [false, false],
    },
    {
      pair: MAINPAIRS[4],
      chainId: 7700,
      expected: [false, false],
    },
  ];
  for (const { pair, chainId, expected } of testCases) {
    expect(checkForCantoInPair(pair, chainId)).toEqual(expected);
  }
});

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

test("calculating expected share of LP", () => {
  const testCases = [
    {
      expectedLPOut: parseUnits("1"),
      currentLP: parseUnits("0"),
      totalLP: parseUnits("99"),
      expected: 0.01,
    },
    {
      expectedLPOut: parseUnits("5"),
      currentLP: parseUnits("5"),
      totalLP: parseUnits("95"),
      expected: 0.1,
    },
  ];

  const testReturns = testCases.map((testCase) =>
    calculateExpectedShareofLP(
      testCase.expectedLPOut,
      testCase.currentLP,
      testCase.totalLP
    )
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(testCases[i].expected);
  }
});

test("calculating LP token limits", () => {
  const testCases = [
    {
      balanceA: parseUnits("1"),
      balanceB: parseUnits("1"),
      ratio: parseUnits("1"),
      limitA: parseUnits("1"),
      limitB: parseUnits("1"),
      atob: true,
    },
    {
      balanceA: parseUnits("100"),
      balanceB: parseUnits("1"),
      ratio: parseUnits("1"),
      limitA: parseUnits("1"),
      limitB: parseUnits("1"),
      atob: true,
    },
    {
      balanceA: parseUnits("100"),
      balanceB: parseUnits("1"),
      ratio: parseUnits("2"),
      limitA: parseUnits("0.5"),
      limitB: parseUnits("1"),
      atob: false,
    },
    {
      balanceA: parseUnits("50"),
      balanceB: parseUnits("10"),
      ratio: parseUnits("10"),
      limitA: parseUnits("50"),
      limitB: parseUnits("5"),
      atob: true,
    },
    {
      balanceA: parseUnits("400"),
      balanceB: parseUnits("50"),
      ratio: parseUnits("100"),
      limitA: parseUnits("0.5"),
      limitB: parseUnits("50"),
      atob: false,
    },
    //testing different decimals
    {
      balanceA: parseUnits("100", 18),
      balanceB: parseUnits("100", 6),
      ratio: parseUnits("1", 30),
      limitA: parseUnits("100", 18),
      limitB: parseUnits("100", 6),
      atob: true,
    },
    {
      balanceA: parseUnits("100", 6),
      balanceB: parseUnits("100", 18),
      ratio: parseUnits("1", 30),
      limitA: parseUnits("100", 6),
      limitB: parseUnits("100", 18),
      atob: false,
    },
  ];

  const testLimitsA = testCases.map((testCase) =>
    getToken1Limit(
      testCase.balanceA,
      testCase.balanceB,
      testCase.ratio,
      testCase.atob
    )
  );
  const testLimitsB = testCases.map((testCase) =>
    getToken2Limit(
      testCase.balanceA,
      testCase.balanceB,
      testCase.ratio,
      testCase.atob
    )
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testLimitsA[i]).toStrictEqual(testCases[i].limitA);
    expect(testLimitsB[i]).toStrictEqual(testCases[i].limitB);
  }
});

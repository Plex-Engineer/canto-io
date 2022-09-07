import {
  calculateExpectedShareofLP,
  getToken1Limit,
  getToken2Limit,
  getTokenAFromB,
  getTokenBFromA,
} from "pages/dexLP/utils/utils";

test("calculating amount from LP ratio", () => {
  const testCases = [
    { tokenAAmount: 1, tokenBAmount: 1, ratio: 1 },
    { tokenAAmount: 2, tokenBAmount: 1, ratio: 2 },
    { tokenAAmount: 5.1231234, tokenBAmount: 1.21979128571, ratio: 4.2 },
    { tokenAAmount: 61503590.6529, tokenBAmount: 5000291923, ratio: 0.0123 },
  ];

  const testReturnsA = testCases.map((testCase) =>
    getTokenAFromB(testCase.tokenBAmount, testCase.ratio)
  );
  const testReturnsB = testCases.map((testCase) =>
    getTokenBFromA(testCase.tokenAAmount, testCase.ratio)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturnsA[i]).toBeCloseTo(testCases[i].tokenAAmount);
    expect(testReturnsB[i]).toBeCloseTo(testCases[i].tokenBAmount);
  }
});

test("calculating expected share of LP", () => {
  const testCases = [
    { expectedLPOut: "1", currentLP: "0", totalLP: "99", expected: 1 },
    { expectedLPOut: "5", currentLP: "5", totalLP: "95", expected: 10 },
  ];

  const testReturns = testCases.map((testCase) =>
    calculateExpectedShareofLP(
      testCase.expectedLPOut,
      testCase.currentLP,
      testCase.totalLP
    )
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBeCloseTo(testCases[i].expected);
  }
});

test("calculating LP token limits", () => {
  const testCases = [
    { balanceA: 1, balanceB: 1, ratio: 1, limitA: "1", limitB: "1" },
    { balanceA: 100, balanceB: 1, ratio: 1, limitA: "1", limitB: "1" },
    { balanceA: 100, balanceB: 1, ratio: 0.5, limitA: "0.5", limitB: "1" },
    { balanceA: 50, balanceB: 10, ratio: 10, limitA: "50", limitB: "5" },
    { balanceA: 400, balanceB: 50, ratio: 0.01, limitA: "0.5", limitB: "50" },
  ];

  const testLimitsA = testCases.map((testCase) =>
    getToken1Limit(testCase.balanceA, testCase.balanceB, testCase.ratio)
  );
  const testLimitsB = testCases.map((testCase) =>
    getToken2Limit(testCase.balanceA, testCase.balanceB, testCase.ratio)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testLimitsA[i]).toBe(testCases[i].limitA);
    expect(testLimitsB[i]).toBe(testCases[i].limitB);
  }
});

import {
  checkBridgeAmountConfirmation,
  checkGravityAddress,
} from "pages/bridge/utils/bridgeConfirmations";

test("checking gravity address is valid", () => {
  const testCases = [
    "gravity1qqzky5czd8jtxp7k96w0d9th2vjxcxaeyxgjqz",
    "gravity",
    "canto1qqzky5czd8jtxp7k96w0d9th2vjxcxaejqm63z",
    "",
    "0xaE9b2c8d2112C7B9907f68aEc6bFc0eB5d95818e",
  ];
  const expected = [true, false, false, false, false];
  const testReturns = testCases.map((testCase) =>
    checkGravityAddress(testCase)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(expected[i]);
  }
});

test("checking bridge amount is valid", () => {
  const expectedReturns = ["bridge out", "enter amount", "insufficient funds"];
  const testCases = [
    { amount: 1, max: 1, expected: expectedReturns[0] },
    { amount: 0.01, max: 1, expected: expectedReturns[0] },
    { amount: 100, max: 100.1, expected: expectedReturns[0] },

    { amount: -1, max: 1, expected: expectedReturns[1] },
    { amount: 0, max: 1, expected: expectedReturns[1] },
    { amount: 0, max: 0, expected: expectedReturns[1] },
    { amount: -0, max: 1, expected: expectedReturns[1] },
    { amount: -0.01, max: -9, expected: expectedReturns[1] },

    { amount: 100, max: 1, expected: expectedReturns[2] },
    { amount: 1.000001, max: 1, expected: expectedReturns[2] },
    { amount: 2, max: 1.9, expected: expectedReturns[2] },
  ];
  const testReturns = testCases.map((testCase) =>
    checkBridgeAmountConfirmation(testCase.amount, testCase.max)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(testCases[i].expected);
  }
});

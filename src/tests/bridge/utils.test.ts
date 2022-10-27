import { checkGravityAddress } from "pages/bridge/utils/bridgeConfirmations";

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

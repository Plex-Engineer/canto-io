import { getStatus } from "pages/bridge/utils/bridgeConfirmations";

test("checking reactive button status is correct", () => {
  const increaseAllowanceString = "increase allowance";
  const sendTokenString = "send token";
  const approveString = "approve";
  const waiting = "waiting for confirmation";
  const randomValue = "random";
  const testCases = [
    { value: waiting, status: "None", expected: waiting },
    { value: sendTokenString, status: "None", expected: sendTokenString },

    {
      value: increaseAllowanceString,
      status: "Mining",
      expected: "increasing allowance",
    },
    { value: approveString, status: "Mining", expected: "approving" },
    { value: sendTokenString, status: "Mining", expected: "sending token" },
    { value: waiting, status: "Mining", expected: waiting },

    {
      value: increaseAllowanceString,
      status: "Success",
      expected: "allowance increased",
    },
    { value: approveString, status: "Success", expected: "approved" },
    { value: sendTokenString, status: "Success", expected: "token sent" },
    { value: waiting, status: "Success", expected: waiting },

    {
      value: sendTokenString,
      status: "Exception",
      expected: "couldn't " + sendTokenString,
    },
    {
      value: sendTokenString,
      status: "Fail",
      expected: "couldn't " + sendTokenString,
    },
    {
      value: randomValue,
      status: "Fail",
      expected: "couldn't " + randomValue,
    },

    {
      value: waiting,
      status: "PendingSignature",
      expected: waiting,
    },
    {
      value: increaseAllowanceString,
      status: "PendingSignature",
      expected: waiting,
    },
    {
      value: sendTokenString,
      status: "PendingSignature",
      expected: waiting,
    },
    {
      value: approveString,
      status: "PendingSignature",
      expected: waiting,
    },
  ];
  const testReturns = testCases.map((testCase) =>
    getStatus(testCase.value, testCase.status)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(testCases[i].expected);
  }
});

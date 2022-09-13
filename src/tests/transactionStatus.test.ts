/* eslint-disable sonarjs/no-duplicate-string */
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";

test("checking reactive button status is correct", () => {
  const enableString = "enable";
  const increaseAllowanceString = "increase allowance";
  const sendTokenString = "send token";
  const addString = "add";
  const removeString = "remove";
  const randomString = "random";

  const enableActions = transactionStatusActions(enableString);
  const increaseAllowanceActions = transactionStatusActions(
    increaseAllowanceString
  );
  const sendTokenActions = transactionStatusActions(sendTokenString);
  const sendTokenActionsWithTokenName = transactionStatusActions(
    sendTokenString,
    "NAME"
  );
  const addActions = transactionStatusActions(addString);
  const removeActions = transactionStatusActions(removeString);
  const randomActions = transactionStatusActions(randomString);

  const testCases = [
    { value: enableActions, status: "None", expected: "enable token" },
    {
      value: increaseAllowanceActions,
      status: "None",
      expected: "increase allowance",
    },
    { value: sendTokenActions, status: "None", expected: "send token" },
    {
      value: sendTokenActionsWithTokenName,
      status: "None",
      expected: "send NAME",
    },
    { value: addActions, status: "None", expected: "add liquidity" },
    { value: removeActions, status: "None", expected: "remove liquidity" },
    { value: randomActions, status: "None", expected: "confirm" },

    {
      value: enableActions,
      status: "PendingSignature",
      expected: "please sign to enable token",
    },
    {
      value: increaseAllowanceActions,
      status: "PendingSignature",
      expected: "please sign to increase allowance",
    },
    {
      value: sendTokenActions,
      status: "PendingSignature",
      expected: "please sign to send token",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "PendingSignature",
      expected: "please sign to send NAME",
    },
    {
      value: addActions,
      status: "PendingSignature",
      expected: "please sign to add liquidity",
    },
    {
      value: removeActions,
      status: "PendingSignature",
      expected: "please sign to remove liquidity",
    },
    {
      value: randomActions,
      status: "PendingSignature",
      expected: "please sign to confirm",
    },

    { value: enableActions, status: "Mining", expected: "enabling token" },
    {
      value: increaseAllowanceActions,
      status: "Mining",
      expected: "increasing allowance",
    },
    { value: sendTokenActions, status: "Mining", expected: "sending token" },
    {
      value: sendTokenActionsWithTokenName,
      status: "Mining",
      expected: "sending NAME",
    },
    { value: addActions, status: "Mining", expected: "adding liquidity" },
    { value: removeActions, status: "Mining", expected: "removing liquidity" },
    { value: randomActions, status: "Mining", expected: "validating" },

    {
      value: enableActions,
      status: "Success",
      expected: "successfully enabled token",
    },
    {
      value: increaseAllowanceActions,
      status: "Success",
      expected: "successfully increased allowance",
    },
    {
      value: sendTokenActions,
      status: "Success",
      expected: "successfully sent token",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "Success",
      expected: "successfully sent NAME",
    },
    {
      value: addActions,
      status: "Success",
      expected: "successfully added liquidity",
    },
    {
      value: removeActions,
      status: "Success",
      expected: "successfully removed liquidity",
    },
    {
      value: randomActions,
      status: "Success",
      expected: "successfully validated",
    },

    {
      value: enableActions,
      status: "Exception",
      expected: "unable to enable token",
    },
    {
      value: increaseAllowanceActions,
      status: "Exception",
      expected: "unable to increase allowance",
    },
    {
      value: sendTokenActions,
      status: "Exception",
      expected: "unable to send token",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "Exception",
      expected: "unable to send NAME",
    },
    {
      value: addActions,
      status: "Exception",
      expected: "unable to add liquidity",
    },
    {
      value: removeActions,
      status: "Exception",
      expected: "unable to remove liquidity",
    },
    {
      value: randomActions,
      status: "Exception",
      expected: "unable to confirm",
    },

    {
      value: enableActions,
      status: "Fail",
      expected: "unable to enable token",
    },
    {
      value: increaseAllowanceActions,
      status: "Fail",
      expected: "unable to increase allowance",
    },
    {
      value: sendTokenActions,
      status: "Fail",
      expected: "unable to send token",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "Fail",
      expected: "unable to send NAME",
    },
    { value: addActions, status: "Fail", expected: "unable to add liquidity" },
    {
      value: removeActions,
      status: "Fail",
      expected: "unable to remove liquidity",
    },
    { value: randomActions, status: "Fail", expected: "unable to confirm" },

    { value: enableActions, status: "Random", expected: "enable token" },
    {
      value: increaseAllowanceActions,
      status: "Random",
      expected: "increase allowance",
    },
    { value: sendTokenActions, status: "Random", expected: "send token" },
    {
      value: sendTokenActionsWithTokenName,
      status: "Random",
      expected: "send NAME",
    },
    { value: addActions, status: "Random", expected: "add liquidity" },
    { value: removeActions, status: "Random", expected: "remove liquidity" },
    { value: randomActions, status: "Random", expected: "confirm" },
  ];
  const testReturns = testCases.map((testCase) =>
    getTransactionStatusString(
      testCase.value.action,
      testCase.value.inAction,
      testCase.value.postAction,
      testCase.status
    )
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(testCases[i].expected);
  }
});

/* eslint-disable sonarjs/no-duplicate-string */
import {
  CantoTransactionType,
  TransactionActionObject,
  TransactionState,
} from "global/config/interfaces/transactionTypes";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";

interface LocalTestType {
  value: TransactionActionObject;
  status?: TransactionState;
  expected: string;
}
test("checking reactive button status is correct", () => {
  const enableActions = transactionStatusActions(CantoTransactionType.ENABLE);
  const increaseAllowanceActions = transactionStatusActions(
    CantoTransactionType.INCREASE_ALLOWANCE
  );
  const sendTokenActions = transactionStatusActions(
    CantoTransactionType.SEND_TOKEN
  );
  const sendTokenActionsWithTokenName = transactionStatusActions(
    CantoTransactionType.SEND_TOKEN,
    "NAME"
  );
  const addActions = transactionStatusActions(
    CantoTransactionType.ADD_LIQUIDITY
  );
  const removeActions = transactionStatusActions(
    CantoTransactionType.REMOVE_LIQUIDITY
  );
  const randomActions = transactionStatusActions(100);

  const testCases: LocalTestType[] = [
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
      expected: "awaiting signature to enable token...",
    },
    {
      value: increaseAllowanceActions,
      status: "PendingSignature",
      expected: "awaiting signature to increase allowance...",
    },
    {
      value: sendTokenActions,
      status: "PendingSignature",
      expected: "awaiting signature to send token...",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "PendingSignature",
      expected: "awaiting signature to send NAME...",
    },
    {
      value: addActions,
      status: "PendingSignature",
      expected: "awaiting signature to add liquidity...",
    },
    {
      value: removeActions,
      status: "PendingSignature",
      expected: "awaiting signature to remove liquidity...",
    },
    {
      value: randomActions,
      status: "PendingSignature",
      expected: "awaiting signature to confirm...",
    },

    { value: enableActions, status: "Mining", expected: "enabling token..." },
    {
      value: increaseAllowanceActions,
      status: "Mining",
      expected: "increasing allowance...",
    },
    { value: sendTokenActions, status: "Mining", expected: "sending token..." },
    {
      value: sendTokenActionsWithTokenName,
      status: "Mining",
      expected: "sending NAME...",
    },
    { value: addActions, status: "Mining", expected: "adding liquidity..." },
    {
      value: removeActions,
      status: "Mining",
      expected: "removing liquidity...",
    },
    { value: randomActions, status: "Mining", expected: "validating..." },

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
      expected: "user denied transaction",
    },
    {
      value: increaseAllowanceActions,
      status: "Exception",
      expected: "user denied transaction",
    },
    {
      value: sendTokenActions,
      status: "Exception",
      expected: "user denied transaction",
    },
    {
      value: sendTokenActionsWithTokenName,
      status: "Exception",
      expected: "user denied transaction",
    },
    {
      value: addActions,
      status: "Exception",
      expected: "user denied transaction",
    },
    {
      value: removeActions,
      status: "Exception",
      expected: "user denied transaction",
    },
    {
      value: randomActions,
      status: "Exception",
      expected: "user denied transaction",
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

    { value: enableActions, status: undefined, expected: "enable token" },
    {
      value: increaseAllowanceActions,
      status: undefined,
      expected: "increase allowance",
    },
    { value: sendTokenActions, status: undefined, expected: "send token" },
    {
      value: sendTokenActionsWithTokenName,
      status: undefined,
      expected: "send NAME",
    },
    { value: addActions, status: undefined, expected: "add liquidity" },
    { value: removeActions, status: undefined, expected: "remove liquidity" },
    { value: randomActions, status: undefined, expected: "confirm" },
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

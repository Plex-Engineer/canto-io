import { parseUnits } from "ethers/lib/utils";
import {
  ALL_BRIDGE_OUT_NETWORKS,
  BridgeOutNetworks,
} from "pages/bridge/config/bridgeOutNetworks";
import {
  EmptySelectedConvertToken,
  EmptySelectedETHToken,
  UserGravityBridgeTokens,
} from "pages/bridge/config/interfaces";
import {
  getBridgeOutButtonText,
  getConvertButtonText,
  getReactiveButtonText,
} from "pages/bridge/utils/reactiveButtonText";

const SELECT_A_TOKEN = "select a token";
const INSUFFICIENT_BALANCE = "insufficient balance";
const ENTER_AMOUNT = "enter amount";

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
    ALL_BRIDGE_OUT_NETWORKS[BridgeOutNetworks.GRAVITY_BRIDGE].checkAddress(
      testCase
    )
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(expected[i]);
  }
});

test("checking cosmos address is valid", () => {
  const testCases = [
    "gravity1qqzky5czd8jtxp7k96w0d9th2vjxcxaeyxgjqz",
    "gravity",
    "canto1qqzky5czd8jtxp7k96w0d9th2vjxcxaejqm63z",
    "",
    "cosmos1qqzky5czd8jfxp7kb6w0d9th2vjxcxaeqk6292",
  ];
  const expected = [false, false, false, false, true];
  const testReturns = testCases.map((testCase) =>
    ALL_BRIDGE_OUT_NETWORKS[BridgeOutNetworks.COSMOS_HUB].checkAddress(testCase)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(testReturns[i]).toBe(expected[i]);
  }
});

test("correct reactive button test (just bridge-in)", () => {
  //status doesn't matter, we have already tested this in transactionStatusStrings, we are only looking for reactive button
  const zero = parseUnits("0");
  const testTokenBalance = parseUnits("100");
  const testTokenWithAllowance: UserGravityBridgeTokens = {
    ...EmptySelectedETHToken,
    balanceOf: testTokenBalance,
    allowance: testTokenBalance,
  };
  const testTokenNoAllowance: UserGravityBridgeTokens = {
    ...EmptySelectedETHToken,
    balanceOf: testTokenBalance,
    allowance: zero,
  };
  const testTokenLowAllowance: UserGravityBridgeTokens = {
    ...EmptySelectedETHToken,
    balanceOf: testTokenBalance,
    allowance: zero.add(1),
  };

  const testCases = [
    {
      hasPubKey: true,
      amount: parseUnits("10"), //amount doesn't matter since allowance is -1
      token: EmptySelectedETHToken,
      expected: {
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      hasPubKey: true,
      amount: zero, //amount doesn't matter since allowance is -1
      token: EmptySelectedETHToken,
      expected: {
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      hasPubKey: true,
      amount: testTokenBalance.add(1), //amount is more than balance and allowance is non-zero
      token: testTokenWithAllowance,
      expected: {
        text: INSUFFICIENT_BALANCE,
        disabled: true,
      },
    },
    {
      hasPubKey: true,
      amount: zero, //amount is zero and allowance is non-zero
      token: testTokenWithAllowance,
      expected: {
        text: ENTER_AMOUNT,
        disabled: true,
      },
    },
    {
      hasPubKey: true,
      amount: testTokenBalance.add(1), //amount is more than balance and allowance is non-zero
      token: testTokenWithAllowance,
      expected: {
        text: INSUFFICIENT_BALANCE,
        disabled: true,
      },
    },
    {
      hasPubKey: true,
      amount: testTokenBalance.add(1), //allowance is zero so approve status shown
      token: testTokenNoAllowance,
      expected: {
        text: "enable token",
        disabled: false,
      },
    },
    {
      hasPubKey: true,
      amount: zero, //allowance is zero so approve status shown
      token: testTokenNoAllowance,
      expected: {
        text: "enable token",
        disabled: false,
      },
    },
    {
      hasPubKey: true,
      amount: testTokenBalance, //allowance is non-zero so increase allowance needed
      token: testTokenLowAllowance,
      expected: {
        text: "increase allowance",
        disabled: false,
      },
    },
    {
      hasPubKey: false,
      amount: parseUnits("10"), //amount doesn't matter since no pub key
      token: testTokenWithAllowance,
      expected: {
        text: "please create public key",
        disabled: true,
      },
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    expect(
      getReactiveButtonText(
        testCases[i].hasPubKey,
        testCases[i].amount,
        testCases[i].token,
        "None",
        "None"
      )
    ).toStrictEqual([
      testCases[i].expected.text,
      testCases[i].expected.disabled,
    ]);
  }
});

test("convert coin button text", () => {
  const nonEmptyTestToken = {
    ...EmptySelectedConvertToken,
    nativeBalance: parseUnits("1"),
  };
  const testCases = [
    {
      amount: parseUnits("10"), //amount doesn't matter since empty convert token
      token: EmptySelectedConvertToken,
      maxAmount: parseUnits("10"),
      cantoToEVM: true,
      expected: {
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount doesn't matter since empty convert token
      token: EmptySelectedConvertToken,
      maxAmount: parseUnits("0"),
      cantoToEVM: false,
      expected: {
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      amount: parseUnits("0"), //amount is zero so nothing entered
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cantoToEVM: true,
      expected: {
        text: ENTER_AMOUNT,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount greater than max
      token: nonEmptyTestToken,
      maxAmount: parseUnits("1"),
      cantoToEVM: true,
      expected: {
        text: INSUFFICIENT_BALANCE,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount okay
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cantoToEVM: true, //bridging in
      expected: {
        text: "bridge in",
        disabled: false,
      },
    },
    {
      amount: parseUnits("10"), //amount okay
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cantoToEVM: false, //bridging out
      expected: {
        text: "bridge out",
        disabled: false,
      },
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    expect(
      getConvertButtonText(
        testCases[i].amount,
        testCases[i].token,
        testCases[i].maxAmount,
        testCases[i].cantoToEVM
      )
    ).toStrictEqual([
      testCases[i].expected.text,
      testCases[i].expected.disabled,
    ]);
  }
});

test("bridge out text", () => {
  //this just checks if the bridge out network address is correct if and only if everything else is good to transfer
  //same tests as above, just with address booleans
  const nonEmptyTestToken = {
    ...EmptySelectedConvertToken,
    nativeBalance: parseUnits("1"),
  };
  const testCases = [
    {
      amount: parseUnits("10"), //amount doesn't matter since empty convert token
      token: EmptySelectedConvertToken,
      maxAmount: parseUnits("10"),
      cosmosAddress: true,
      expected: {
        //expected same as before
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount doesn't matter since empty convert token
      token: EmptySelectedConvertToken,
      maxAmount: parseUnits("0"),
      cosmosAddress: false,
      expected: {
        //expected same as before
        text: SELECT_A_TOKEN,
        disabled: true,
      },
    },
    {
      amount: parseUnits("0"), //amount is zero so nothing entered
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cosmosAddress: true,
      expected: {
        //expected same as before
        text: ENTER_AMOUNT,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount greater than max
      token: nonEmptyTestToken,
      maxAmount: parseUnits("1"),
      cosmosAddress: true,
      expected: {
        //expected same as before
        text: INSUFFICIENT_BALANCE,
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount okay
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cosmosAddress: false, //address not okay
      expected: {
        text: "invalid address",
        disabled: true,
      },
    },
    {
      amount: parseUnits("10"), //amount okay
      token: nonEmptyTestToken,
      maxAmount: parseUnits("10"),
      cosmosAddress: true, //address okay
      expected: {
        text: "bridge out",
        disabled: false,
      },
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    expect(
      getBridgeOutButtonText(
        testCases[i].amount,
        testCases[i].token,
        testCases[i].maxAmount,
        testCases[i].cosmosAddress
      )
    ).toStrictEqual([
      testCases[i].expected.text,
      testCases[i].expected.disabled,
    ]);
  }
});

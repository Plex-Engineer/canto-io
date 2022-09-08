export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ");
}

export const formatBalance = (num: string | number) => {
  if (Number(num) > 1) {
    return (Math.floor(Number(Number(num).toFixed(3)) * 100) / 100).toFixed(2);
  } else if (num == 0) {
    return "0.00";
  } else {
    return (Math.floor(Number(Number(num).toFixed(5)) * 10000) / 10000).toFixed(
      4
    );
  }
};

export const noteSymbol = "Ꞥ";

export function truncateNumber(value: string, decimals?: number) {
  value = removeLeadingZeros(value);
  value = convertFromScientificNotation(value);
  const decimalLocation = value.indexOf(".");
  if (Number(value) == 0) {
    return "0";
  }
  if (decimalLocation == -1) {
    return value;
  }
  if (!decimals) {
    if (Number(value) > 1) {
      return value.slice(0, decimalLocation + 3);
    }
    return value.slice(0, findFirstNonZeroAfter(value, decimalLocation) + 3);
  }
  return value.slice(0, decimalLocation + decimals + 1);
}

function findFirstNonZeroAfter(value: string, after: number) {
  for (let i = after + 1; i < value.length; i++) {
    if (value[i] != "0") {
      return i;
    }
  }
  return value.length - 1;
}

export function removeLeadingZeros(value: string) {
  for (let i = 0; i < value.length; i++) {
    if (value[i] != "0") {
      return value.slice(value[i] == "." ? i - 1 : i);
    }
  }
  return "0";
}

export function convertFromScientificNotation(value: string) {
  const scientificEIndex = value.toLowerCase().indexOf("e");
  const decimalLocation = value.indexOf(".");
  if (scientificEIndex != -1) {
    const scientificNotationValue = Number(
      value.slice(scientificEIndex + 1, value.length)
    );
    let unformattedNumber =
      decimalLocation == -1
        ? value.slice(0, scientificEIndex)
        : value.slice(0, decimalLocation) +
          value.slice(decimalLocation + 1, scientificEIndex);
    if (scientificNotationValue < 0) {
      value =
        "0." + "0".repeat(-scientificNotationValue - 1) + unformattedNumber;
    } else {
      unformattedNumber =
        unformattedNumber.length < scientificNotationValue
          ? unformattedNumber +
            "0".repeat(scientificNotationValue - unformattedNumber.length + 1)
          : unformattedNumber;
      value =
        unformattedNumber.slice(0, scientificNotationValue + 1) +
        "." +
        unformattedNumber.slice(
          scientificNotationValue + 1,
          unformattedNumber.length
        );
    }
  }
  return value;
}

export function getTransactionStatusString(
  action: string,
  inAction: string,
  postAction: string,
  status?: string
) {
  switch (status) {
    case "None":
      return action;
    case "PendingSignature":
      return "please sign to " + action;
    case "Mining":
      return inAction;
    case "Success":
      return "successfully " + postAction;
    case "Exception":
    case "Fail":
      return "unable to " + action;
    default:
      return action;
  }
}

export const transactionStatusActions = (
  actionType: string,
  tokenName?: string
) => {
  const token = tokenName ?? "token";
  switch (actionType) {
    case "enable":
      return {
        action: `enable ${token}`,
        inAction: `enabling ${token}`,
        postAction: `enabled ${token}`,
      };
    case "increase allowance":
      return {
        action: "increase allowance",
        inAction: "increasing allowance",
        postAction: "increased allowance",
      };
    case "send token":
      return {
        action: `send ${token}`,
        inAction: `sending ${token}`,
        postAction: `sent ${token}`,
      };
    case "add":
      return {
        action: "add liquidity",
        inAction: "adding liquidity",
        postAction: "added liquidity",
      };
    case "claim":
      return {
        action: "claim",
        inAction: "claiming",
        postAction: "claimed",
      };
    case "remove":
      return {
        action: "remove liquidity",
        inAction: "removing liquidity",
        postAction: "removed liquidity",
      };
    default:
      return {
        action: "confirm",
        inAction: "validating",
        postAction: "validated",
      };
  }
};

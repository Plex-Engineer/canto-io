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
  let decimalLocation = value.indexOf(".");
  const scientificEIndex = value.indexOf("e");
  if (scientificEIndex != -1) {
    const scientificNotationValue = value.slice(
      scientificEIndex + 1,
      value.length
    );
    if (scientificNotationValue[0] == "-") {
      value =
        "0." +
        "0".repeat(
          Number(scientificNotationValue.slice(1, value.length)) -
            decimalLocation
        ) +
        value.slice(0, decimalLocation) +
        value.slice(decimalLocation + 1, scientificEIndex);
    }
    //TODO for scientific notation positive
  }
  decimalLocation = value.indexOf(".");
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
  return value.slice(0, decimalLocation + decimals);
}

function findFirstNonZeroAfter(value: string, after: number) {
  for (let i = after + 1; i < value.length; i++) {
    if (value[i] != "0") {
      return i - 1;
    }
  }
  return value.length - 1;
}

import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

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

export function formatLiquidity(liquidity: number) {
  if (liquidity < 2) {
    return liquidity.toFixed(4);
  }
  if (liquidity < 10000) {
    return liquidity.toFixed(2);
  }
  if (liquidity < 1000000) {
    return (liquidity / 1000).toFixed(1) + "k";
  }
  if (liquidity < 1000000000) return (liquidity / 1000000).toFixed(1) + "M";

  return (liquidity / 1000000000).toFixed(1) + "B";
}

export function convertStringToBigNumber(amount: string, decimals: number) {
  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    return BigNumber.from(0);
  }
  return parseUnits(truncateNumber(amount, decimals), decimals);
}

export function convertBigNumberRatioIntoPercentage(
  numerator: BigNumber,
  denominator: BigNumber
) {
  return Number(
    formatUnits(numerator.mul(BigNumber.from(10).pow(18)).div(denominator))
  );
}

/**
 * ALL TRUNCATION FUNCTIONS
 */
export function truncateNumber(value: string, decimals?: number) {
  if (!value || isNaN(Number(value))) {
    return "";
  }
  value = removeLeadingZeros(value);
  value = convertFromScientificNotation(value);
  const decimalLocation = value.indexOf(".");
  if (Number(value) == 0) {
    return "0";
  }
  if (decimalLocation == -1) {
    return value;
  }
  if (!decimals && decimals != 0) {
    if (Number(value) > 1) {
      return value.slice(0, decimalLocation + 3);
    }
    //if the value is really small we can just show zero
    if (findFirstNonZeroAfter(value, decimalLocation) - decimalLocation > 8) {
      return "0.00";
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
      //if first index is a decimal point we will add the zero before it
      const zeroPad = value[i] == "." ? "0" : "";
      return zeroPad + value.slice(i);
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

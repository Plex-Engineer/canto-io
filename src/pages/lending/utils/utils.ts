import { BigNumber } from "ethers";

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

//special function, input must be factored by 100% (i.e 1000%) since Big Numbers are to the whole number and precision will be to the hundreths place
export function formatBigNumberToPercentage(percent: BigNumber) {
  const bnString = percent.toString();
  const decimalIndex = bnString.length - 2;
  return Number(
    bnString.slice(0, decimalIndex) + "." + bnString.slice(decimalIndex)
  );
}

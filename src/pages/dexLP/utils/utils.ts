import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/formattingNumbers";

//ratio that returns is scaled to 1e18 for accuracy
export function getLPPairRatio(
  reserveA?: BigNumber,
  reserveB?: BigNumber
): [BigNumber, boolean] {
  if (!reserveA || !reserveB) {
    return [BigNumber.from(1), true];
  }
  if (reserveA.gte(reserveB)) {
    return [reserveA.mul(BigNumber.from(10).pow(18)).div(reserveB), true];
  } else {
    return [reserveB.mul(BigNumber.from(10).pow(18)).div(reserveA), false];
  }
}
export function getTokenBFromA(
  tokenAAmount: BigNumber,
  ratio: BigNumber,
  aTob: boolean
): BigNumber {
  if (aTob) {
    return tokenAAmount.mul(BigNumber.from(10).pow(18)).div(ratio);
  }
  return tokenAAmount.mul(ratio).div(BigNumber.from(10).pow(18));
}

export function getTokenAFromB(
  tokenBAmount: BigNumber,
  ratio: BigNumber,
  aTob: boolean
): BigNumber {
  if (aTob) {
    return tokenBAmount.mul(ratio).div(BigNumber.from(10).pow(18));
  }
  return tokenBAmount.mul(BigNumber.from(10).pow(18)).div(ratio);
}

export function calculateExpectedShareIfSupplying(
  currentShare: number,
  expectedLPOut: BigNumber,
  totalLP: BigNumber
) {
  return formatUnits(
    totalLP
      .mul(parseUnits(currentShare.toString()))
      .add(expectedLPOut.mul(BigNumber.from(10).pow(18)))
      .div(totalLP.add(expectedLPOut))
      .mul(100)
  );
}

//getting token limits when additing liquidity

export function getToken1Limit(
  balanceA: BigNumber,
  balanceB: BigNumber,
  ratio: BigNumber,
  aToB: boolean
) {
  const aFromAllB = getTokenAFromB(balanceB, ratio, aToB);
  if (aFromAllB.gt(balanceA)) {
    return balanceA;
  } else {
    return aFromAllB;
  }
}

export function getToken2Limit(
  balanceA: BigNumber,
  balanceB: BigNumber,
  ratio: BigNumber,
  aTob: boolean
) {
  const bFromAllA = getTokenBFromA(balanceA, ratio, aTob);
  if (bFromAllA.gt(balanceB)) {
    return balanceB;
  } else {
    return bFromAllA;
  }
}

//used for displaying in Dex, ratio scaled by 1e18
export function getReserveRatioAtoB(
  ratio: BigNumber,
  aTob: boolean,
  aDecimals: number,
  bDecimals: number
) {
  if (aTob) {
    return 1 / Number(formatUnits(ratio, 18 + aDecimals - bDecimals));
  } else {
    return Number(formatUnits(ratio, 18 + bDecimals - aDecimals));
  }
}

//price is scaled by 1e18
export function valueInNote(amount: BigNumber, price: BigNumber) {
  return price.mul(amount).div(BigNumber.from(10).pow(18));
}

//get value of token from percent entry
export function getTokenValueFromPercent(
  tokenValue: BigNumber,
  percent: number
) {
  if (percent <= 0 || isNaN(percent)) {
    return BigNumber.from(0);
  }
  const percentScaledTo18 = parseUnits(
    truncateNumber(percent.toString(), 18),
    18
  );
  return tokenValue.mul(percentScaledTo18).div(parseUnits("1", 20));
}

import { BigNumber } from "ethers";

//returns button text and function it will perform onClick
export function getEnableTokenText(
  token1Symbol: string,
  token2Symbol: string,
  token1Allowance: BigNumber,
  token2Allowance: BigNumber
): string {
  if (token1Allowance.gt(0) && token2Allowance.gt(0)) {
    return "enabled";
  } else if (token1Allowance.gt(0)) {
    return `enable ${token2Symbol} token`;
  } else if (token2Allowance.gt(0)) {
    return `enable ${token1Symbol} token`;
  } else {
    return `enable ${token1Symbol} / ${token2Symbol} tokens`;
  }
}

//returns text for the button and if it is disabled
export function getAddButtonTextAndOnClick(
  token1Balance: BigNumber,
  token2Balance: BigNumber,
  value1: BigNumber,
  value2: BigNumber,
  slippage: number,
  deadline: number
): [string, boolean] {
  if (value1.isZero() || value2.isZero()) {
    return ["enter amount", true];
  } else if (value1.gt(token1Balance) || value2.gt(token2Balance)) {
    return ["insufficient balance", true];
  } else if (slippage < 0 || deadline <= 0) {
    return ["invalid settings", true];
  } else {
    return ["add liquidity", false];
  }
}
//returns text for the button and if it is disabled
export function getRemoveButtonTextAndOnClick(
  slippage: number,
  deadline: number,
  percentage: number
): [string, boolean] {
  if (isNaN(percentage) || percentage > 100 || percentage < 0) {
    return ["enter percentage", true];
  } else if (
    isNaN(slippage) ||
    slippage < 0 ||
    isNaN(deadline) ||
    deadline <= 0
  ) {
    return ["invalid settings", true];
  } else {
    return ["remove liquidity", false];
  }
}

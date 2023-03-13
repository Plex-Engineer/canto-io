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

//returns button text and function it will perform onClick
export function getEnableButtonTextAndOnClick(
  token1Symbol: string,
  token2Symbol: string,
  token1Allowance: BigNumber,
  token2Allowance: BigNumber,
  addAllowance1: () => void,
  addAllowance2: () => void
): [string, () => void] {
  if (token1Allowance.gt(0) && token2Allowance.gt(0)) {
    return [
      "enabled",
      () => {
        return;
      },
    ];
  } else if (token1Allowance.gt(0)) {
    return [`enable ${token2Symbol}`, addAllowance2];
  } else if (token2Allowance.gt(0)) {
    return [`enable ${token1Symbol}`, addAllowance1];
  } else {
    return [
      `enable ${token1Symbol} / ${token2Symbol} tokens`,
      () => {
        addAllowance1();
        addAllowance2();
      },
    ];
  }
}
//returns text for the button, function it will perform, and if it is disabled
export function getAddButtonTextAndOnClick(
  token1Symbol: string,
  token2Symbol: string,
  token1Allowance: BigNumber,
  token2Allowance: BigNumber,
  token1Balance: BigNumber,
  token2Balance: BigNumber,
  value1: BigNumber,
  value2: BigNumber,
  slippage: number,
  deadline: number,
  addAllowance1: () => void,
  addAllowance2: () => void,
  addLiquidity: () => void
): [string, () => void, boolean] {
  const emptyFunction = () => {
    return;
  };
  const needToken1Allowance = value1.gt(token1Allowance);
  const needToken2Allowance = value2.gt(token2Allowance);
  if (needToken1Allowance && needToken2Allowance) {
    return [
      `enable ${token1Symbol} & ${token2Symbol}`,
      () => {
        addAllowance1();
        addAllowance2();
      },
      false,
    ];
  } else if (needToken1Allowance && !needToken2Allowance) {
    return [`increase ${token1Symbol} allowance`, addAllowance1, false];
  } else if (!needToken1Allowance && needToken2Allowance) {
    return [`increase ${token2Symbol} allowance`, addAllowance2, false];
  } else if (value1.isZero() || value2.isZero()) {
    return ["enter amount", emptyFunction, true];
  } else if (value1.gt(token1Balance) || value2.gt(token2Balance)) {
    return ["insufficient balance", emptyFunction, true];
  } else if (slippage < 0 || deadline <= 0) {
    return ["invalid settings", emptyFunction, true];
  } else {
    return ["add liquidity", addLiquidity, false];
  }
}
//returns text for the button, function it will perform, and if it is disabled
export function getRemoveButtonTextAndOnClick(
  LPSymbol: string,
  LPAllowance: BigNumber,
  value1: BigNumber,
  slippage: number,
  deadline: number,
  percentage: number,
  addAllowance1: () => void,
  removeLiquidity: () => void
): [string, () => void, boolean] {
  const emptyFunction = () => {
    return;
  };
  if (value1.gt(LPAllowance)) {
    return [`increase ${LPSymbol} allowance`, addAllowance1, false];
  } else if (isNaN(percentage) || percentage > 100 || percentage < 0) {
    return ["enter percentage", emptyFunction, true];
  } else if (slippage < 0 || deadline <= 0) {
    return ["invalid settings", emptyFunction, true];
  } else {
    return ["remove liquidity", removeLiquidity, false];
  }
}

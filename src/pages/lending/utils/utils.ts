import { BigNumber } from "ethers";
import { UserLMTokenDetails } from "../config/interfaces";

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

//used and limit both in terms of note, collateral factor is raised to 10^18
//percent of limit will give how much, in terms of note can be withdrawn to stay under this limit
function maxWithdrawal(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number
) {
  return limit
    .sub(used.mul(100).div(percentOfLimit))
    .mul(BigNumber.from(10).pow(18))
    .div(collateralFactor);
}
//will return boolean for if withdrawal of the token at its price will go over the limit
//withdraw amount will be the amount of the token in terms of Note
export function willWithdrawalGoOverLimit(
  used: BigNumber,
  limit: BigNumber,
  collateralFactor: BigNumber,
  percentOfLimit: number,
  withdrawAmount: BigNumber
) {
  return maxWithdrawal(used, limit, collateralFactor, percentOfLimit).lt(
    withdrawAmount
  );
}

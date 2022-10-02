import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { truncateNumber } from "global/utils/utils";

export function convertStringToBigNumber(amount: string, decimals: number) {
  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    return BigNumber.from(0);
  }
  return parseUnits(truncateNumber(amount, decimals), decimals);
}

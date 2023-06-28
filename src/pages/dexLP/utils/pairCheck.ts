import { BigNumber, Contract } from "ethers";
import { routerAbi } from "global/config/abi";
import { PAIR } from "../config/interfaces";
import {
  getCantoNetwork,
  getCurrentProvider,
} from "global/utils/getAddressUtils";

//function returns if pair contains WCANTO, since we must call a different function for supplying or Withdrawing liquidity
//returns [isToken1Canto, isToken2Canto]
export function checkForCantoInPair(pair: PAIR, chainId?: number) {
  return [
    isTokenCanto(pair.token1.address, chainId),
    isTokenCanto(pair.token2.address),
  ];
}
export function isTokenCanto(token: string, chainId?: number): boolean {
  const WCANTO = getCantoNetwork(chainId).coreContracts.WCANTO;
  return token == WCANTO;
}
export async function getExpectedLP(
  chainId: number,
  pair: PAIR,
  amount1: BigNumber,
  amount2: BigNumber
) {
  const provider = getCurrentProvider(chainId);
  const routerAddress = getCantoNetwork(chainId).coreContracts.Router;
  const RouterContract = new Contract(routerAddress, routerAbi, provider);

  const LPOut = await RouterContract.quoteAddLiquidity(
    pair.token1.address,
    pair.token2.address,
    pair.stable,
    amount1,
    amount2
  );
  return LPOut.liquidity;
}

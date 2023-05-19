import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { TOKENS } from "global/config/tokenInfo";
import { BigNumber, Contract, ethers } from "ethers";
import { ADDRESSES } from "global/config/addresses";
import { routerAbi } from "global/config/abi";
import { PAIR } from "../config/interfaces";

//function returns if pair contains WCANTO, since we must call a different function for supplying or Withdrawing liquidity
//returns [isToken1Canto, isToken2Canto]
export function checkForCantoInPair(pair: PAIR, chainId?: number) {
  return [
    isTokenCanto(pair.token1.address, chainId),
    isTokenCanto(pair.token2.address),
  ];
}
export function isTokenCanto(token: string, chainId?: number): boolean {
  const WCANTO =
    chainId == CantoTestnet.chainId
      ? TOKENS.cantoTestnet.WCANTO.address
      : TOKENS.cantoMainnet.WCANTO.address;
  return token == WCANTO;
}
export async function getExpectedLP(
  chainId: number,
  pair: PAIR,
  amount1: BigNumber,
  amount2: BigNumber
) {
  const providerURL =
    CantoTestnet.chainId == chainId ? CantoTestnet.rpcUrl : CantoMainnet.rpcUrl;
  const provider = new ethers.providers.JsonRpcProvider(providerURL);
  const routerAddress =
    CantoTestnet.chainId == chainId
      ? ADDRESSES.testnet.PriceFeed
      : ADDRESSES.cantoMainnet.PriceFeed;
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

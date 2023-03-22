import { CantoTestnet } from "global/config/networks";
import { PAIR } from "../config/pairs";
import { TOKENS } from "global/config/tokenInfo";

//function returns if pair contains WCANTO, since we must call a different function for supplying or Withdrawing liquidity
//returns [isToken1Canto, isToken2Canto]
export function checkForCantoInPair(pair: PAIR, chainId?: number) {
  const WCANTO =
    chainId == CantoTestnet.chainId
      ? TOKENS.cantoTestnet.WCANTO.address
      : TOKENS.cantoMainnet.WCANTO.address;
  return [pair.token1.address == WCANTO, pair.token2.address == WCANTO];
}

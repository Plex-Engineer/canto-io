import { CTOKEN } from "global/config/interfaces/tokens";
import { CantoTestnet } from "global/config/networks";
import { CantoMainnet } from "global/config/networks";
import { CTOKENS } from "global/config/tokenInfo";

export function getCTokensForChainId(chainId?: number) {
  switch (chainId) {
    case CantoTestnet.chainId:
      return CANTO_TEST_C_TOKENS;
    case CantoMainnet.chainId:
    default:
      return CANTO_MAIN_C_TOKENS;
  }
}

const CANTO_TEST_C_TOKENS: CTOKEN[] = [
  CTOKENS.cantoTestnet.CCANTO,
  CTOKENS.cantoTestnet.CNOTE,
  CTOKENS.cantoTestnet.CETH,
  CTOKENS.cantoTestnet.CATOM,
  CTOKENS.cantoTestnet.CUSDC,
  CTOKENS.cantoTestnet.CUSDT,
  CTOKENS.cantoTestnet.CCantoNote,
  CTOKENS.cantoTestnet.CCantoAtom,
  CTOKENS.cantoTestnet.CNoteUSDC,
  CTOKENS.cantoTestnet.CNoteUSDT,
  CTOKENS.cantoTestnet.CCantoETH,
  CTOKENS.cantoTestnet.cRWA,
];

const CANTO_MAIN_C_TOKENS = [
  CTOKENS.cantoMainnet.CCANTO,
  CTOKENS.cantoMainnet.CNOTE,
  CTOKENS.cantoMainnet.CETH,
  CTOKENS.cantoMainnet.CATOM,
  CTOKENS.cantoMainnet.CUSDC,
  CTOKENS.cantoMainnet.CUSDT,
  CTOKENS.cantoMainnet.CCantoNote,
  CTOKENS.cantoMainnet.CCantoAtom,
  CTOKENS.cantoMainnet.CNoteUSDC,
  CTOKENS.cantoMainnet.CNoteUSDT,
  CTOKENS.cantoMainnet.CCantoETH,
];

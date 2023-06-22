import { BigNumber } from "ethers";

export enum TokenGroups {
  DEX_TOKENS = "DEX_TOKENS",
  IBC_TOKENS = "IBC_TOKENS",
  LP_TOKENS = "LP_TOKENS",
}

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  isERC20: boolean;
  isLP: boolean;
  icon: string;
  tokenGroups: TokenGroups[];
  balance?: BigNumber;
  //this will check if we should just grab native balance for this token instead of balanceOf
  isNative?: boolean;
  nativeBalance?: BigNumber;
  nativeSymbol?: string;
  //bridging props
  isOFT?: boolean;
}

export interface CTOKEN {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  underlying: Token;
}

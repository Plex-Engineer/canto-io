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
}

export interface CTOKEN {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  underlying: Token;
}

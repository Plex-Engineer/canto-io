export interface LMToken {
  data: Data;
  wallet: string;
  balanceOf: string;
  balanceOfC: string;
  borrowBalance: string;
  exchangeRate: string;
  supplyBalance: string;
  liquidity: string;
  cash: string;
  allowance: boolean;
  collateralFactor: string;
  inSupplyMarket: boolean;
  inBorrowMarket: boolean;
  supplyBalanceinNote: string;
  borrowBalanceinNote: string;
  collateral: boolean;
  price: string;
  supplyAPY: number;
  borrowAPY: number;
  isListed: boolean;
  compSpeed: number;
  distAPY: number;
  borrowCap: string | number;
  rewards: string;
}

export interface Data {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  underlying: Underlying;
}

export interface Underlying {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  isERC20: boolean;
  isLP: boolean;
  icon: string;
  cTokenAddress: string;
}

export interface LMTokenDetails {
  totalSupply: number;
  totalBorrow: number;
  totalBorrowLimit: number;
  totalBorrowLimitUsed: number;
  balance: LMBalance;
}

export interface LMBalance {
  walletBalance: string | undefined;
  price: string | undefined;
  accrued: number;
  cantroller: string;
  wallet: string;
}

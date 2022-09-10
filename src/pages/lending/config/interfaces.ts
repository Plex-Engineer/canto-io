export interface LMToken {
  data: TokenData;
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
export interface TokenData {
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

export interface LMTokenDetails1 {
  data: TokenData;
  exchangeRate: string;
  liquidity: string;
  cash: string;
  collateralFactor: string;
  price: string;
  supplyAPY: number;
  borrowAPY: number;
  isListed: boolean;
  compSpeed: number;
  distAPY: number;
  borrowCap: string | number;
}
export interface UserLMTokenDetails extends LMTokenDetails1 {
  wallet: string;
  balanceOf: string;
  balanceOfC: string;
  borrowBalance: string;
  supplyBalance: string;
  allowance: boolean;
  inSupplyMarket: boolean;
  inBorrowMarket: boolean;
  supplyBalanceinNote: string;
  borrowBalanceinNote: string;
  collateral: boolean;
  rewards: string;
}

export interface UserLMPosition {
  totalSupply: number;
  totalBorrow: number;
  totalBorrowLimit: number;
  totalBorrowLimitUsed: number;
  balance: UserRewards;
}

export interface UserRewards {
  walletBalance: string | undefined;
  price: string | undefined;
  accrued: number;
  cantroller: string;
  wallet: string;
}

export const EmptyUserLMDetails = {
  wallet: "0",
  balanceOf: "0",
  balanceOfC: "0",
  borrowBalance: "0",
  supplyBalance: "0",
  allowance: false,
  inSupplyMarket: false,
  inBorrowMarket: false,
  supplyBalanceinNote: "0",
  borrowBalanceinNote: "0",
  collateral: false,
  rewards: "0",
};

export const EmptyUserRewards = {
  walletBalance: "0",
  accrued: 0,
  wallet: "0",
};

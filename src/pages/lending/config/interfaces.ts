import { BigNumber } from "ethers";

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
  cash: BigNumber;
  exchangeRate: BigNumber;
  collateralFactor: BigNumber;
  price: BigNumber;
  borrowCap: BigNumber;
  isListed: boolean;
  liquidity: string;
  supplyAPY: number;
  borrowAPY: number;
  distAPY: number;
}
export interface UserLMTokenDetails extends LMTokenDetails1 {
  wallet?: string;
  balanceOf: BigNumber;
  balanceOfC: BigNumber;
  borrowBalance: BigNumber;
  supplyBalance: BigNumber;
  supplyBalanceinNote: BigNumber;
  borrowBalanceinNote: BigNumber;
  allowance: boolean;
  inSupplyMarket: boolean;
  inBorrowMarket: boolean;
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

export interface BNUserLMPosition {
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  totalBorrowLimit: BigNumber;
  rewards: BNUserRewards;
}

export interface BNUserRewards {
  walletBalance: BigNumber;
  price: BigNumber;
  accrued: number;
  cantroller: string;
  wallet?: string;
}

export const EmptyUserLMDetails = {
  balanceOf: BigNumber.from(0),
  balanceOfC: BigNumber.from(0),
  borrowBalance: BigNumber.from(0),
  supplyBalance: BigNumber.from(0),
  allowance: false,
  inSupplyMarket: false,
  inBorrowMarket: false,
  supplyBalanceinNote: BigNumber.from(0),
  borrowBalanceinNote: BigNumber.from(0),
  collateral: false,
  rewards: "0",
};

export const EmptyUserPosition = {
  totalSupply: BigNumber.from(0),
  totalBorrow: BigNumber.from(0),
  totalBorrowLimit: BigNumber.from(0),
  totalBorrowLimitUsed: BigNumber.from(0),
};
export const EmptyUserRewards = {
  walletBalance: BigNumber.from(0),
  price: BigNumber.from(0),
  accrued: 0,
  cantroller: "",
};

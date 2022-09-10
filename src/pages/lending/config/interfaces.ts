import { BigNumber } from "ethers";

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

export interface LMTokenDetails {
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
export interface UserLMTokenDetails extends LMTokenDetails {
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
  rewards: BigNumber;
}

export interface UserLMPosition {
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  totalBorrowLimit: BigNumber;
  rewards: UserLMRewards;
}

export interface UserLMRewards {
  walletBalance: BigNumber;
  price: BigNumber;
  accrued: BigNumber;
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
  rewards: BigNumber.from(0),
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
  accrued: BigNumber.from(0),
  cantroller: "",
};

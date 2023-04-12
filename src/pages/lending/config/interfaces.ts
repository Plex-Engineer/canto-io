import { BigNumber } from "ethers";
import { CTOKEN } from "global/config/tokenInfo";

export interface LMTokenDetails {
  data: CTOKEN;
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
  allowance: BigNumber;
  inSupplyMarket: boolean;
  inBorrowMarket: boolean;
  collateral: boolean;
  rewards: BigNumber;
}

export interface UserLMPosition {
  totalSupply: BigNumber;
  totalBorrow: BigNumber;
  totalBorrowLimit: BigNumber;
}

export interface UserLMRewards {
  walletBalance: BigNumber;
  price: BigNumber;
  accrued: BigNumber;
  cantroller: string;
  wallet?: string;
  comptrollerBalance: BigNumber;
}

export const EmptyActiveLMToken: UserLMTokenDetails = {
  data: {
    symbol: "",
    name: "",
    decimals: 0,
    address: "",
    underlying: {
      symbol: "",
      name: "",
      decimals: 0,
      address: "",
      isERC20: false,
      isLP: false,
      icon: "",
      tokenGroups: [],
    },
  },
  cash: BigNumber.from(0),
  exchangeRate: BigNumber.from(0),
  collateralFactor: BigNumber.from(0),
  price: BigNumber.from(0),
  borrowCap: BigNumber.from(0),
  isListed: false,
  liquidity: "",
  supplyAPY: 0,
  borrowAPY: 0,
  distAPY: 0,
  balanceOf: BigNumber.from(0),
  balanceOfC: BigNumber.from(0),
  borrowBalance: BigNumber.from(0),
  supplyBalance: BigNumber.from(0),
  allowance: BigNumber.from(0),
  inSupplyMarket: false,
  inBorrowMarket: false,
  supplyBalanceinNote: BigNumber.from(0),
  borrowBalanceinNote: BigNumber.from(0),
  collateral: false,
  rewards: BigNumber.from(0),
};

export const EmptyUserLMDetails = {
  balanceOf: BigNumber.from(0),
  balanceOfC: BigNumber.from(0),
  borrowBalance: BigNumber.from(0),
  supplyBalance: BigNumber.from(0),
  allowance: BigNumber.from(0),
  inSupplyMarket: false,
  inBorrowMarket: false,
  supplyBalanceinNote: BigNumber.from(0),
  borrowBalanceinNote: BigNumber.from(0),
  collateral: false,
  rewards: BigNumber.from(0),
};

export const EmptyUserPosition: UserLMPosition = {
  totalSupply: BigNumber.from(0),
  totalBorrow: BigNumber.from(0),
  totalBorrowLimit: BigNumber.from(0),
};
export const EmptyUserRewards: UserLMRewards = {
  walletBalance: BigNumber.from(0),
  price: BigNumber.from(0),
  accrued: BigNumber.from(0),
  cantroller: "",
  comptrollerBalance: BigNumber.from(0),
};

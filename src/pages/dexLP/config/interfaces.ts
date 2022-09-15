import { BigNumber } from "ethers";
import { PAIR } from "./pairs";

export interface LPPairInfo {
  basePairInfo: PAIR;
  totalSupply: {
    totalLP: BigNumber;
    tvl: BigNumber;
    token1: BigNumber;
    token2: BigNumber;
    //ratio uses bignumber division, so we have to know what the ratio is since could be 0 if dividing the wrong way
    ratio: {
      //if true, ratio is a/b otherwise it is b/a
      aTob: boolean;
      ratio: BigNumber;
    };
  };
  prices: {
    //prices are in terms of Note for 1 unit of token (scaled by decimals)
    token1: BigNumber;
    token2: BigNumber;
  };
}

export interface UserLPPairInfo extends LPPairInfo {
  userSupply: {
    totalLP: BigNumber;
    token1: BigNumber;
    token2: BigNumber;
    percentOwned: number;
  };
  balances: {
    token1: BigNumber;
    token2: BigNumber;
  };

  allowance: {
    token1: BigNumber;
    token2: BigNumber;
    LPtoken: BigNumber;
  };
}

export const EmptyUserLPPairInfo = {
  userSupply: {
    totalLP: BigNumber.from(0),
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    percentOwned: 0,
  },
  balances: {
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
  },
  allowance: {
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    LPtoken: BigNumber.from(0),
  },
};

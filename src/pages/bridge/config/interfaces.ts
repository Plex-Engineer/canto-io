import { BigNumber } from "ethers";

export interface GravityTokens {
  data: {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    isERC20: boolean;
    isLP: boolean;
    icon: string;
    cTokenAddress: string;
    nativeName: string;
  };
}
export interface UserGravityTokens extends GravityTokens {
  wallet: string;
  balanceOf: BigNumber;
  allowance: BigNumber;
}

export interface UserNativeGTokens extends UserGravityTokens {
  nativeBalanceOf: BigNumber;
}

export const EmptyUserGTokenData = {
  wallet: "",
  balanceOf: BigNumber.from(0),
  allowance: BigNumber.from(0),
};

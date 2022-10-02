import { BigNumber } from "ethers";
import emptyToken from "assets/empty.svg";

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

export const emptySelectedToken: UserNativeGTokens = {
  data: {
    isERC20: false,
    isLP: false,
    symbol: "select token",
    address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
    cTokenAddress: "",
    decimals: 6,
    icon: emptyToken,
    name: "select token",
    nativeName: "none",
  },
  wallet: "",
  allowance: BigNumber.from(-1),
  balanceOf: BigNumber.from(-1),
  nativeBalanceOf: BigNumber.from(0),
};

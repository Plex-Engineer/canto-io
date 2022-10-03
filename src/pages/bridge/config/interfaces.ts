import { BigNumber } from "ethers";
import emptyToken from "assets/empty.svg";
import { Token } from "cantoui";

export interface BaseToken extends Token {
  [x: string | number | symbol]: unknown;
}
export interface NativeERC20Tokens extends BaseToken {
  nativeName: string;
}

export interface UserERC20Tokens extends NativeERC20Tokens {
  erc20Balance: BigNumber;
  wallet: string;
}
export interface UserNativeTokens extends NativeERC20Tokens {
  nativeBalance: BigNumber;
  wallet: string;
}
export interface UserConvertToken extends NativeERC20Tokens {
  erc20Balance: BigNumber;
  nativeBalance: BigNumber;
  wallet: string;
}

export interface UserGravityBridgeTokens extends BaseToken {
  balanceOf: BigNumber;
  allowance: BigNumber;
  wallet: string;
}

export const EmptyUserGTokenData = {
  wallet: "",
  balanceOf: BigNumber.from(0),
  allowance: BigNumber.from(0),
};
const emptyTokenData = {
  isERC20: false,
  isLP: false,
  symbol: "select token",
  address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
  cTokenAddress: "",
  decimals: 6,
  icon: emptyToken,
  name: "select token",
  wallet: "",
};
export const EmptySelectedConvertToken = {
  ...emptyTokenData,
  nativeName: "ibc/000",
  erc20Balance: BigNumber.from(-1),
  nativeBalance: BigNumber.from(0),
};
export const EmptySelectedETHToken = {
  ...emptyTokenData,
  allowance: BigNumber.from(-1),
  balanceOf: BigNumber.from(-1),
};
export const EmptySelectedNativeToken = {
  ...emptyTokenData,
  nativeName: "ibc/000",
  nativeBalance: BigNumber.from(0),
};
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

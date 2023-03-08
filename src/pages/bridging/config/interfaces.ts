import { BigNumber } from "ethers";
import { Token } from "global/config/tokenInfo";
import emptyToken from "assets/empty.svg";

export interface BaseToken extends Token {
  [x: string | number | symbol]: unknown;
}
export interface UserERC20Token extends BaseToken {
  erc20Balance: BigNumber;
}
export interface UserBridgeInToken extends UserERC20Token {
  allowance: BigNumber;
}
export interface NativeToken extends BaseToken {
  ibcDenom: string;
  nativeName: string;
}
export interface UserNativeToken extends NativeToken {
  nativeBalance: BigNumber;
}
export interface UserConvertToken extends UserNativeToken, UserERC20Token {}

//Empty token data for initialization
const EMPTY_TOKEN: Token = {
  isERC20: false,
  isLP: false,
  symbol: "choose token",
  address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
  decimals: 6,
  icon: emptyToken,
  name: "choose token",
};
export const EMPTY_BRIDGE_IN_TOKEN: UserBridgeInToken = {
  ...EMPTY_TOKEN,
  erc20Balance: BigNumber.from(-1),
  allowance: BigNumber.from(-1),
};
export const EMPTY_BRIDGE_OUT_TOKEN: UserNativeToken = {
  ...EMPTY_TOKEN,
  nativeBalance: BigNumber.from(-1),
  nativeName: "none",
  ibcDenom: "ibc/000",
};
export const EMPTY_CONVERT_TOKEN: UserConvertToken = {
  ...EMPTY_BRIDGE_OUT_TOKEN,
  erc20Balance: BigNumber.from(-1),
};

export interface ConvertTransaction {
  origin: string;
  timeLeft: string;
  amount: BigNumber;
  token: UserConvertToken;
}

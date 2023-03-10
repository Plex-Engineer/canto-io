import { BigNumber } from "ethers";
import { Token } from "global/config/tokenInfo";
import emptyToken from "assets/empty.svg";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";

/**
 * NETWORK INTERFACES
 */
export interface BridgeOutNetworkInfo {
  name: string;
  icon: string;
  tokens: NativeToken[];
  channel: string;
  endpoint: string;
  latestBlockEndpoint?: string;
  addressBeginning: string;
  checkAddress: (address: string) => boolean;
}
export enum BridgeOutNetworks {
  GRAVITY_BRIDGE,
  COSMOS_HUB,
  COMDEX,
  OSMOSIS,
  SOMMELIER,
  INJECTIVE,
  KAVA,
  AKASH,
  CRESCENT,
}

/**
 * TOKEN INTERFACES
 */
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
  supportedOutChannels: BridgeOutNetworks[];
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
  erc20Balance: BigNumber.from(0),
  allowance: BigNumber.from(0),
};
export const EMPTY_BRIDGE_OUT_TOKEN: UserNativeToken = {
  ...EMPTY_TOKEN,
  nativeBalance: BigNumber.from(0),
  nativeName: "none",
  ibcDenom: "ibc/000",
  supportedOutChannels: [],
};
export const EMPTY_CONVERT_TOKEN: UserConvertToken = {
  ...EMPTY_BRIDGE_OUT_TOKEN,
  erc20Balance: BigNumber.from(0),
};

/**
 * TRANSACTION INTERFACES
 */
export interface ConvertTransaction {
  origin: string;
  timeLeft: string;
  amount: BigNumber;
  token: UserConvertToken;
}

/**
 * MODAL INTERFACES
 */
export interface BridgeModal {
  amount: BigNumber;
  token: BaseToken;
  max: BigNumber;
  tx: BridgeTransaction;
  txType: "BRIDGE_IN" | "CONVERT" | "BRIDGE_OUT";
  from: {
    chain: string;
    address: string;
  };
  to: {
    chain: string;
    address: string;
  };
  onClose: () => void;
}

import { BigNumber, ethers } from "ethers";
import { Token } from "global/config/tokenInfo";
import emptyToken from "assets/empty.svg";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import { ReactNode } from "react";

/**
 * NETWORK INTERFACES
 */

/**
 * cantoChannel is the channel that you must use to ibc FROM canto
 * networkChannel is the channel that you must use from the respective chain TO canto
 */
export interface BridgeOutNetworkInfo {
  name: string;
  chainId: string;
  icon: string;
  tokens: NativeToken[];
  nativeDenom: string;
  cantoChannel: string;
  networkChannel: string;
  restEndpoint: string;
  rpcEndpoint: string;
  extraEndpoints?: string[];
  latestBlockEndpoint?: string;
  addressBeginning: string;
  checkAddress: (address?: string) => boolean;
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
  SENTINEL,
  EVMOS,
  PERSISTENCE,
  STRIDE,
  QUICKSILVER,
}

/**
 * TOKEN INTERFACES
 */
export interface BaseToken extends Token {
  [x: string | number | symbol]: unknown;
}

export interface UserERC20BridgeToken extends BaseToken {
  erc20Balance: BigNumber;
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
export const EMPTY_ERC20_BRIDGE_TOKEN: UserERC20BridgeToken = {
  ...EMPTY_TOKEN,
  erc20Balance: BigNumber.from(0),
  allowance: BigNumber.from(ethers.constants.MaxUint256),
};
export const EMPTY_NATIVE_TOKEN: UserNativeToken = {
  ...EMPTY_TOKEN,
  ibcDenom: "",
  nativeName: "",
  supportedOutChannels: [],
  nativeBalance: BigNumber.from(0),
};

/**
 * TRANSACTION INTERFACES
 */
export interface NativeTransaction {
  origin: string;
  timeLeft: string;
  amount: BigNumber;
  token: UserNativeToken;
}

/**
 * MODAL INTERFACES
 */
export interface BridgeModal {
  amount: BigNumber;
  token: BaseToken;
  tx: BridgeTransaction;
  from: {
    chain: string;
    address: string;
    chainId: number;
  };
  to: {
    chain: string;
    address: string;
  };
  onClose: () => void;
  ibcData?: {
    userInputAddress: string;
    setUserInputAddress: (s: string) => void;
    selectedNetwork: BridgeOutNetworkInfo;
    setSelectedNetwork: (n: BridgeOutNetworkInfo) => void;
  };
  extraDetails?: ReactNode;
}

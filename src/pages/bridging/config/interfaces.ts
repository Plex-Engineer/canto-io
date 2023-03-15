import { BigNumber, ethers } from "ethers";
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

//THESE TYPES ARE ONLY USED IN THE WALKTHROUGH
export interface UserERC20Token extends BaseToken {
  erc20Balance: BigNumber;
}
export interface UserConvertToken extends UserNativeToken, UserERC20Token {}
export interface UserBridgeInToken extends UserERC20Token {
  allowance: BigNumber;
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
}

import { BigNumber, ethers } from "ethers";
import emptyToken from "assets/empty.svg";
import { Token } from "global/config/interfaces/tokens";
import { NativeToken as NToken } from "pages/bridging/config/bridgingInterfaces";

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
  tokens: NativeToken[] | NToken[];
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
export enum CantoMainBridgeOutNetworks {
  GRAVITY_BRIDGE = "Gravity Bridge",
  COSMOS_HUB = "Cosmos Hub",
  COMDEX = "Comdex",
  OSMOSIS = "Osmosis",
  SOMMELIER = "Sommelier",
  INJECTIVE = "Injective",
  KAVA = "Kava",
  AKASH = "Akash",
  CRESCENT = "Crescent",
  SENTINEL = "Sentinel",
  EVMOS = "Evmos",
  PERSISTENCE = "Persistence",
  STRIDE = "Stride",
  QUICKSILVER = "Quicksilver",
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
interface NativeToken extends BaseToken {
  ibcDenom: string;
  nativeName: string;
  supportedOutChannels?: CantoMainBridgeOutNetworks[];
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
  tokenGroups: [],
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
